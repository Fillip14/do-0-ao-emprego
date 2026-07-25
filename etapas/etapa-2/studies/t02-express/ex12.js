import express from 'express';
import tasksRoutes, { asyncHandler } from './routes-t02/tasks.routes.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;
const TASKS_PREFIX = '/tasks';

app.use(express.json());
app.use(morgan('combined'));

app.use(TASKS_PREFIX, tasksRoutes);

app.get(
  '/boom',
  asyncHandler(async (req, res) => {
    await new Promise((r) => setTimeout(r, 100));
    throw new Error('boom');
  }),
);

app.get('/boom-try', async (req, res, next) => {
  try {
    await new Promise((r) => setTimeout(r, 100));
    throw new Error('boom');
  } catch (err) {
    next(err);
  }
});

// Pagina não encontrada
app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  next(err);
});

// Tratador de erro central
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    errors: [{ message: err.message }],
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// curl -i localhost:3000/boom
// HTTP/1.1 500 Internal Server Error
// X-Powered-By: Express
// Content-Type: application/json; charset=utf-8
// Content-Length: 31
// ETag: W/"1f-djGbv0pLCpGAaqMhE10nQTXgYng"
// Date: Wed, 22 Jul 2026 11:31:51 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5

// {"errors":[{"message":"boom"}]}
