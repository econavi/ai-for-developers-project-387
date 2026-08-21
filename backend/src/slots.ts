/**
 * Логика генерации свободных слотов.
 *
 * Рабочие часы: пн–пт, 09:00–18:00 UTC.
 * Шаг генерации: 30 минут.
 * Из результата исключаются слоты, пересекающиеся с существующими бронированиями.
 */

import { store } from './store.js';
import type { BookingRecord } from './store.js';

const WORK_START_HOUR = 9;  // 09:00 UTC
const WORK_END_HOUR = 18;   // 18:00 UTC
const SLOT_STEP_MINUTES = 30;

// Компоненты «последней миллисекунды суток» для инклюзивной границы окна
// бронирования. setUTCHours принимает время по частям, поэтому вместо
// магических чисел (23, 59, 59, 999) в месте вызова фиксируем их здесь:
// смысл значения — не «время работы», а максимально поздний момент суток,
// который ещё попадает в окно при сравнении current <= windowEnd.
const END_OF_DAY_HOURS = 23;
const END_OF_DAY_MINUTES = 59;
const END_OF_DAY_SECONDS = 59;
const END_OF_DAY_MILLISECONDS = 999;

/**
 * Вернуть копию даты, нормализованную к концу суток в UTC (23:59:59.999).
 *
 * Копия обязательна: parseDateParam при отсутствии или невалидном значении
 * возвращает переданный fallback по ссылке, и мутация такого общего объекта
 * привела бы к скрытым побочным эффектам у вызывающего кода.
 */
function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setUTCHours(
    END_OF_DAY_HOURS,
    END_OF_DAY_MINUTES,
    END_OF_DAY_SECONDS,
    END_OF_DAY_MILLISECONDS,
  );
  return end;
}

export interface Slot {
  startTime: string;
  endTime: string;
}

function parseDateParam(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

/**
 * Вернуть список свободных слотов для указанного типа события.
 */
export function getAvailableSlots(
  eventTypeId: string,
  dateFromStr?: string,
  dateToStr?: string,
): Slot[] {
  const eventType = store.eventTypes.getById(eventTypeId);
  if (!eventType) return [];

  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  const dateFrom = parseDateParam(dateFromStr, now);

  const defaultTo = new Date(now);
  defaultTo.setUTCDate(defaultTo.getUTCDate() + 13); // 14 дней включая сегодня
  const dateTo = parseDateParam(dateToStr, defaultTo);
  // Нормализуем копию dateTo к концу дня: параметр в формате YYYY-MM-DD
  // парсится как полночь 00:00, а счётчик current идёт с 09:00. Без этой
  // нормализации последний день окна всегда оказывается меньше первого
  // рабочего слота (09:00 > 00:00), и цикл while его пропускает.
  const windowEnd = endOfDay(dateTo);

  const durationMs = eventType.durationMinutes * 60 * 1000;
  const stepMs = SLOT_STEP_MINUTES * 60 * 1000;

  const allBookings = store.bookings.getAll();
  const slots: Slot[] = [];

  const current = new Date(dateFrom);
  current.setUTCHours(WORK_START_HOUR, 0, 0, 0);

  while (current <= windowEnd) {
    const dayOfWeek = current.getUTCDay();

    // Только будние дни
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dayStart = new Date(current);
      dayStart.setUTCHours(WORK_START_HOUR, 0, 0, 0);
      const dayEnd = new Date(current);
      dayEnd.setUTCHours(WORK_END_HOUR, 0, 0, 0);

      const slotStart = new Date(dayStart);
      while (slotStart.getTime() + durationMs <= dayEnd.getTime()) {
        const slotEnd = new Date(slotStart.getTime() + durationMs);
        const slot: Slot = {
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
        };

        if (!isSlotOverlapping(slot, allBookings)) {
          slots.push(slot);
        }

        slotStart.setTime(slotStart.getTime() + stepMs);
      }
    }

    current.setUTCDate(current.getUTCDate() + 1);
    current.setUTCHours(WORK_START_HOUR, 0, 0, 0);
  }

  return slots;
}

function isSlotOverlapping(slot: Slot, bookings: BookingRecord[]): boolean {
  return bookings.some(
    (b) =>
      new Date(slot.startTime) < new Date(b.endTime) &&
      new Date(slot.endTime) > new Date(b.startTime),
  );
}
