import express from 'express';
import tasksRoutes from './routes-t02/tasks.routes.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;
const TASKS_PREFIX = '/tasks';

app.use(express.json());
app.use(morgan('combined'));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(req.method, req.originalUrl, res.statusCode, `${Date.now() - start}ms`);
  });

  next();
});

app.use(TASKS_PREFIX, tasksRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// morgan("combined") pois ele deixa mais detalhado
// combined: ::1 - - [21/Jul/2026:23:08:31 +0000] "GET /tasks/23 HTTP/1.1" 404 49 "-" "curl/8.18.0"
// dev: GET /tasks/23 404 0.439 ms - 49
// meu: GET /tasks 200 1ms
// curl -i http://localhost:3000/task
