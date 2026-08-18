import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:3001/api';

interface EventType {
  id: string;
  title: string;
}

test.describe('Бронирование звонка (гостевой сценарий)', () => {
  let eventType: EventType;
  const uniqueTitle = `Консультация ${Date.now()}`;

  test.beforeAll(async () => {
    const res = await fetch(`${API_BASE}/event-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: uniqueTitle, description: 'Тестовый тип', durationMinutes: 30 }),
    });
    const created = await res.json() as { id: string };
    eventType = { id: created.id, title: uniqueTitle };
  });

  test('Полный путь: выбор типа → выбор слота → форма → подтверждение', async ({ page }) => {
    await page.goto('/');

    // Шаг 1: список типов событий загружен, карточка с уникальным названием видна
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();

    // Шаг 2: клик по карточке типа события
    await page.getByRole('heading', { name: uniqueTitle }).click();
    await page.waitForURL(`/event-types/${eventType.id}`);

    // Шаг 3: дождаться загрузки слотов и кликнуть по первому
    await expect(page.getByText('Доступные слоты')).toBeVisible({ timeout: 15000 });
    await page.locator('button:visible').first().click();

    // Кнопка «Забронировать» появляется после выбора слота
    await expect(page.getByRole('button', { name: 'Забронировать' })).toBeVisible();
    await page.getByRole('button', { name: 'Забронировать' }).click();
    await page.waitForURL(`/event-types/${eventType.id}/book`);

    // Шаг 4: заполнить форму
    await page.getByLabel('Ваше имя').fill('Иван Петров');
    await page.getByLabel('Email').fill('ivan@example.com');
    await page.getByRole('button', { name: 'Подтвердить бронирование' }).click();

    // Шаг 5: страница подтверждения
    await expect(page.getByText('Бронирование подтверждено!')).toBeVisible();
    await expect(page.getByText(uniqueTitle)).toBeVisible();
    await expect(page.getByText('Иван Петров')).toBeVisible();
    await expect(page.getByText('ivan@example.com')).toBeVisible();
  });
});
