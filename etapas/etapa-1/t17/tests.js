// import assert from 'node:assert';
// import { addTask, completeTask, removeTask } from './lib.js'

// const tasks = [{ id: 1, title: 'Task 1', done: false }];
// const task1 = 'Task 1';
// const task2 = 'Task 2';

// assert.deepStrictEqual(addTask([], task1), [{ id: 1, title: 'Task 1', done: false }]);
// assert.deepStrictEqual(completeTask(tasks, 1), [{ id: 1, title: 'Task 1', done: true }]);
// assert.deepStrictEqual(tasks, [{ id: 1, title: 'Task 1', done: false }]);
// assert.deepStrictEqual(removeTask(tasks, 1), []);

// assert.deepStrictEqual(completeTask(completeTask(tasks, 1) ,1), [{ id: 1, title: 'Task 1', done: false }]);

// assert.deepStrictEqual(removeTask(addTask(tasks, 'Task 2'), 1), [{ id: 2, title: 'Task 2', done: false }]);

// assert.throws(
//   () => addTask([], ''),
//   (err) => err.message === 'invalid title',
// );

// assert.throws(
//   () => completeTask(tasks, 2),
//   (err) => err.message === 'task not found',
// );

// assert.throws(
//   () => removeTask(tasks, 2),
//   (err) => err.message === 'task not found',
// );
