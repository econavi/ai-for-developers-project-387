/**
 * Получение свободных слотов для типа события.
 */

import { Router } from 'express';
import { store } from '../store.js';
import { getAvailableSlots } from '../slots.js';

export const slotsRouter = Router();

slotsRouter.get('/:id/slots', (req, res) => {
  const eventType = store.eventTypes.getById(req.params.id);
  if (!eventType) {
    res.status(404).json({ error: 'Event type not found' });
    return;
  }

  const dateFrom = req.query.dateFrom as string | undefined;
  const dateTo = req.query.dateTo as string | undefined;

  const slots = getAvailableSlots(req.params.id, dateFrom, dateTo);
  res.json({ slots });
});
