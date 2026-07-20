import express, { type NextFunction, type Response, type Request } from 'express';
import { query } from './db.js';

const app = express();

app.disable('x-powered-by');
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, req.url);
  next();
});

const validateTitle = (req: Request, res: Response, next: NextFunction) => {
  const title = req.body?.title;

  if (typeof title !== 'string' || title.trim() === '')
    return res.status(400).json({ message: 'Invalid title' });

  next();
};

const validateId = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!UUID.test(id)) return res.status(400).json({ message: 'Invalid id' });

  next();
};

app.get('/tasks', async (req: Request, res: Response) => {
  const result = await query('SELECT id, title, done FROM tasks ORDER BY created_at ASC');
  return res.status(200).json(result.rows);
});

app.get('/tasks/:id', validateId, async (req: Request<{ id: string }>, res: Response) => {
  const taskId = req.params.id;
  const result = await query('SELECT id, title, done FROM tasks WHERE id = $1', [taskId]);

  if (result.rowCount === 0) return res.status(404).json({ message: 'Task not found' });

  return res.status(200).json(result.rows[0]);
});

app.post('/tasks', validateTitle, async (req: Request, res: Response) => {
  const title = req.body.title;
  const result = await query('INSERT INTO tasks (title) VALUES($1) RETURNING id, title, done', [
    title,
  ]);

  return res.status(201).json(result.rows[0]);
});

app.patch('/tasks/:id', validateId, validateTitle, async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const newTitle = req.body.title;

  const result = await query(
    'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING id, title, done',
    [newTitle, taskId],
  );

  if (result.rowCount === 0) return res.status(404).json({ message: 'Task not found' });

  return res.status(200).json(result.rows[0]);
});

app.delete('/tasks/:id', validateId, async (req: Request<{ id: string }>, res: Response) => {
  const taskId = req.params.id;

  const result = await query('DELETE FROM tasks WHERE id = $1', [taskId]);

  if (result.rowCount === 0) return res.status(404).json({ message: 'Task not found' });

  return res.status(200).json({ message: 'Removed' });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: 'An unexpected error occurred' });
});

export default app;
