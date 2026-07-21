import { Router } from 'express';
const tasksRoutes = Router();

tasksRoutes.get('/:id', (req, res) => {
  const idNumber = Number(req.params.id);

  if (idNumber <= 0 || !Number.isInteger(idNumber))
    return res.status(400).json({ errors: [{ field: 'id', message: 'invalid id' }] });
  return res.json({ id: req.params.id, typeofId: typeof req.params.id });
});

tasksRoutes.get('/:listId/items/:itemId', (req, res) => {
  return res.json({ listId: req.params.listId, itemId: req.params.itemId });
});

export default tasksRoutes;
