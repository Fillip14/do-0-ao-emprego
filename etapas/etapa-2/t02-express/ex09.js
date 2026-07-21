import express from 'express';
import tasksRoutes from './routes/tasks.routes.js';

const app = express();
const port = process.env.PORT || 3000;
const TASKS_PREFIX = '/tasks';

app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(req.method, req.originalUrl, res.statusCode, `${Date.now() - start}ms`);
  });
  res.send();
  next();
});

app.use(TASKS_PREFIX, tasksRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Antes do express.json() = depois do expres.json() pois o logger não mexe com o body que é o que o express.json() faz
// Depois das rotas não imprime porque ele começa em sequencia, ele ja passou na rota e ja respondeu, parou a fila
// Fica pendurada pra sempre porque a request fica parada naqueal fila esperando ser finalizada
// res.send() antes do next no middleware da erro: Cannot set headers after they are sent to the client
// curl -i http://localhost:3000/task
