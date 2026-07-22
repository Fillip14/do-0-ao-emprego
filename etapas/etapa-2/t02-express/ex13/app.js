import express from 'express';
import tasksRoutes, { asyncHandler } from './routes/tasks.routes.js';
import morgan from 'morgan';

const app = express();
const TASKS_PREFIX = '/tasks';

app.use(express.json());
app.use(morgan('combined'));

app.use(TASKS_PREFIX, tasksRoutes);

// Pagina não encontrada
app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  next(err);
});

// Tratador de erro central
app.use((err, req, res, next) => {
  //   console.error(err);
  res.status(err.status || 500).json({
    errors: [{ message: err.message }],
  });
});

export default app;
