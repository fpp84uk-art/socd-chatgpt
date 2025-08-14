import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import webhookRouter from './routes/webhooks.js';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ name: 'SOCD Webhooks API (facade)', status: 'ok', forwardBase: process.env.N8N_WEBHOOK_BASE || null });
});

app.use('/', webhookRouter);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.path }));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SOCD Webhooks facade listening on :${PORT}`));
