/**
 * Список бронирований (владелец) и создание (гость).
 * При создании проверяется, что слот не занят.
 */

import { Router } from 'express';
import crypto from 'node:crypto';
import { store } from '../store.js';

export const bookingsRouter = Router();

bookingsRouter.get('/', (_req, res) => {
  const list = store.bookings.getAll();
  res.json(list);
});

bookingsRouter.post('/', (req, res) => {
  const { eventTypeId, guestName, guestEmail, startTime } = req.body;

  if (!eventTypeId || !guestName || !guestEmail || !startTime) {
    res.status(400).json({ error: 'eventTypeId, guestName, guestEmail, startTime are required' });
    return;
  }

  const eventType = store.eventTypes.getById(eventTypeId);
  if (!eventType) {
    res.status(404).json({ error: 'Event type not found' });
    return;
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) {
    res.status(400).json({ error: 'Invalid startTime format' });
    return;
  }

  const endMs = start.getTime() + eventType.durationMinutes * 60 * 1000;
  const endTime = new Date(endMs).toISOString();

  if (store.bookings.hasOverlap(start.toISOString(), endTime)) {
    res.status(409).json({ error: 'Slot already booked' });
    return;
  }

  const booking = store.bookings.create({
    id: crypto.randomUUID(),
    eventTypeId,
    guestName,
    guestEmail,
    startTime: start.toISOString(),
    endTime,
    createdAt: new Date().toISOString(),
  });

  res.json(booking);
});
