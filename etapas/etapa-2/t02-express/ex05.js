import express from 'express';
import tasksRoutes from './routes-t02/tasks.routes.js';

const app = express();
const port = process.env.PORT || 3000;
const TASKS_PREFIX = '/tasks';

app.use(express.json());
app.use(TASKS_PREFIX, tasksRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// curl -i  http://localhost:3000/tasks/abc
// curl -i  http://localhost:3000/tasks/abc/items/123
// formato de erro: {errors: [lista erros]} assim fica mais organizado e mais explicito
// curl -i http://localhost:3000/api/tasks/abc
// HTTP/1.1 400 Bad Request
// X-Powered-By: Express
// Content-Type: application/json; charset=utf-8
// Content-Length: 50
// ETag: W/"32-APKsPwUaHfQzYTZ8zer1WwlHpgk"
// Date: Tue, 21 Jul 2026 18:06:46 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5

// {"errors":[{"field":"id","message":"invalid id"}]}
