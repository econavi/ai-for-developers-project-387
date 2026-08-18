/**
 * CRUD для типов событий.
 * POST/PUT/DELETE — только для владельца (без аутентификации).
 */

import { Router } from 'express';
import crypto from 'node:crypto';
import { store } from '../store.js';

export const eventTypesRouter = Router();

eventTypesRouter.get('/', (_req, res) => {
  const list = store.eventTypes.getAll();
  res.json(list);
});

eventTypesRouter.get('/:id', (req, res) => {
  const item = store.eventTypes.getById(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Event type not found' });
    return;
  }
  res.json(item);
});

eventTypesRouter.post('/', (req, res) => {
  const { title, description, durationMinutes } = req.body;

  if (!title || typeof durationMinutes !== 'number') {
    res.status(400).json({ error: 'title and durationMinutes are required' });
    return;
  }

  const eventType = store.eventTypes.create({
    id: crypto.randomUUID(),
    title,
    description: description ?? undefined,
    durationMinutes,
  });

  res.json(eventType);
});

eventTypesRouter.put('/:id', (req, res) => {
  const { title, description, durationMinutes } = req.body;

  const updated = store.eventTypes.update(req.params.id, {
    title,
    description,
    durationMinutes,
  });

  if (!updated) {
    res.status(404).json({ error: 'Event type not found' });
    return;
  }

  res.json(updated);
});

eventTypesRouter.delete('/:id', (req, res) => {
  const deleted = store.eventTypes.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Event type not found' });
    return;
  }
  res.status(204).send();
});
