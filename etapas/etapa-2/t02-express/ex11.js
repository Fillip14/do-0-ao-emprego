import express from 'express';
import tasksRoutes from './routes/tasks.routes.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;
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
  console.error(err);
  res.status(err.status || 500).json({
    errors: [{ message: err.message }],
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// curl -i http://localhost:3000/task
// curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"comprar pão"}'
// curl -i localhost:3000/tasks -X Pcurl -i localhost:3000/tasks -X POST -H "Content-Type: application/json" -d '{"title":""}'   # 400 title
// curl -i localhost:3000/naoexiste                                                              # 404 coringa
// curl -i localhost:3000/tasks/99                                                               # 404 not found

// HTTP/1.1 400 Bad Request
// X-Powered-By: Express
// Content-Type: application/json; charset=utf-8
// Content-Length: 44
// ETag: W/"2c-N5g01Ss8Pl9nYn5IHb1wY5/d8sg"
// Date: Tue, 21 Jul 2026 23:26:55 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
// {"errors":[{"message":"title is required"}]}

// HTTP/1.1 404 Not Found
// X-Powered-By: Express
// Content-Type: application/json; charset=utf-8
// Content-Length: 36
// ETag: W/"24-l1BpiHAyE4+8uMoEe/tJKrHWBFU"
// Date: Tue, 21 Jul 2026 23:26:55 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
// {"errors":[{"message":"not found"}]}

// HTTP/1.1 404 Not Found
// X-Powered-By: Express
// Content-Type: application/json; charset=utf-8
// Content-Length: 36
// ETag: W/"24-l1BpiHAyE4+8uMoEe/tJKrHWBFU"
// Date: Tue, 21 Jul 2026 23:26:55 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5
// {"errors":[{"message":"not found"}]}
