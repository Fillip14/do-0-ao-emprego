const assert = require('node:assert');
const { TaskStore, ValidationError, NotFoundError } = require('./ex15.js');

const store = new TaskStore();
assert.deepStrictEqual(store.add('Task n1'), {
  id: 1,
  title: 'Task n1',
  done: false,
});

assert.deepStrictEqual(store.add('Task n2'), {
  id: 2,
  title: 'Task n2',
  done: false,
});

const beforeList = store.list();
beforeList[1].title = 'Task n3';

assert.deepStrictEqual(store.list(), [
  { id: 1, title: 'Task n1', done: false },
  { id: 2, title: 'Task n2', done: false },
]);

assert.deepStrictEqual(store.toggle(1), { id: 1, title: 'Task n1', done: true });
assert.deepStrictEqual(store.toggle(1), { id: 1, title: 'Task n1', done: false });
assert.deepStrictEqual(store.remove(1), undefined);

assert.throws(
  () => store.add(),
  (err) => err instanceof ValidationError && err.message === 'invalid title',
);

assert.throws(
  () => store.add(' '),
  (err) => err instanceof ValidationError && err.message === 'invalid title',
);

assert.throws(
  () => store.add('    '),
  (err) => err instanceof ValidationError && err.message === 'invalid title',
);

assert.throws(
  () => store.add(42),
  (err) => err instanceof ValidationError && err.message === 'invalid title',
);

assert.throws(
  () => store.toggle(3),
  (err) => err instanceof NotFoundError && err.message === 'task not found',
);

assert.throws(
  () => store.remove(3),
  (err) => err instanceof NotFoundError && err.message === 'task not found',
);

assert.strictEqual(store.add === TaskStore.prototype.add, true);
