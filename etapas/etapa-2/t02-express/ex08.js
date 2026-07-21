import express from 'express';
import tasksRoutes from './routes/tasks.routes.js';

const app = express();
const port = process.env.PORT || 3000;
const TASKS_PREFIX = '/tasks';

app.use(express.json());
app.use(TASKS_PREFIX, tasksRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"comprar pão"}'
// curl -i  http://localhost:3000/tasks/3
// curl -i  -X DELETE http://localhost:3000/tasks/3
