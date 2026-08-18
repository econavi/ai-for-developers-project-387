/**
 * Calendar Call — бэкенд на Express + TypeScript.
 * Хранилище in-memory, все данные сбрасываются при перезапуске.
 *
 * В production (когда есть директория public/) раздаёт статику
 * фронтенда и работает как SPA-fallback.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import { eventTypesRouter } from './routes/eventTypes.js';
import { slotsRouter } from './routes/slots.js';
import { bookingsRouter } from './routes/bookings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

// API-маршруты
app.use('/api/event-types', eventTypesRouter);
app.use('/api/event-types', slotsRouter);
app.use('/api/bookings', bookingsRouter);

// Production: раздача статики фронтенда
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // SPA fallback — любой не-API запрос отдаёт index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
  console.log(`Serving static files from ${publicDir}`);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
