/**
 * In-memory хранилище данных.
 * После перезапуска сервера данные сбрасываются.
 */

export interface EventTypeRecord {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
}

export interface BookingRecord {
  id: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  createdAt: string; // ISO
}

const eventTypes: EventTypeRecord[] = [];
const bookings: BookingRecord[] = [];

export const store = {
  eventTypes: {
    getAll: () => eventTypes,
    getById: (id: string) => eventTypes.find((e) => e.id === id) ?? null,
    create: (record: EventTypeRecord) => {
      eventTypes.push(record);
      return record;
    },
    update: (id: string, data: Partial<EventTypeRecord>) => {
      const idx = eventTypes.findIndex((e) => e.id === id);
      if (idx === -1) return null;
      eventTypes[idx] = { ...eventTypes[idx], ...data };
      return eventTypes[idx];
    },
    delete: (id: string) => {
      const idx = eventTypes.findIndex((e) => e.id === id);
      if (idx === -1) return false;
      eventTypes.splice(idx, 1);
      return true;
    },
  },

  bookings: {
    getAll: () => bookings,
    getById: (id: string) => bookings.find((b) => b.id === id) ?? null,
    create: (record: BookingRecord) => {
      bookings.push(record);
      return record;
    },
    /** Проверить, пересекается ли интервал [start, end) с существующими бронированиями */
    hasOverlap: (startTime: string, endTime: string, excludeId?: string) =>
      bookings.some(
        (b) =>
          b.id !== excludeId &&
          new Date(startTime) < new Date(b.endTime) &&
          new Date(endTime) > new Date(b.startTime),
      ),
  },
};
