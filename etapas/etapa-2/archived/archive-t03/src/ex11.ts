type RouteConfig = {
  method: 'GET' | 'POST';
  path: string;
};

// o `as` calou o compilador — mas tem um erro plantado aqui.
const routes = {
  list: { method: 'GET', path: '/tasks' },
  create: { method: 'POST', path: '/tasks' }, // ← 'PSOT'
  get: { method: 'GET', path: '/tasks/:id' },
} satisfies Record<string, RouteConfig>;

routes.list?.method;
