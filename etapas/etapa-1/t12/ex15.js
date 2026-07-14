const user = {
  name: 'Ana',
  hi() {
    return `hi ${this.name}`;
  },
  bye: () => `bye ${this.name}`,
};
// 1: user.hi()  hi Ana
// 2: user.bye() → bye undefined
const f = user.hi;
// 3: f()        → hi undefined
class A {
  constructor() {
    this.x = 1;
  }
  get() {
    return this.x;
  }
}
const a = new A();
// 4: a.get()               → 1
// 5: A.prototype.get === a.get → true

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class TaskStore {
  constructor() {
    this.tasks = [];
    this.id = 0;
  }

  add(title) {
    if (typeof title !== 'string' || (typeof title === 'string' && title.trim() === ''))
      throw new ValidationError('invalid title');

    const newTask = {};
    newTask['id'] = ++this.id;
    newTask['title'] = title;
    newTask['done'] = false;

    this.tasks.push(newTask);

    return newTask;
  }

  toggle(id) {
    if (!this.tasks.some((task) => task.id === id)) throw new NotFoundError('task not found');

    const taskUpdated = this.tasks.find((task) => task.id === id);

    taskUpdated.done = taskUpdated.done ? false : true;

    return taskUpdated;
  }

  remove(id) {
    if (!this.tasks.some((task) => task.id === id)) throw new NotFoundError('task not found');

    this.tasks = this.tasks.filter((task) => task.id !== id);

    return undefined;
  }

  list() {
    const copy = JSON.parse(JSON.stringify(this.tasks));

    return copy;
  }
}

module.exports = { TaskStore, ValidationError, NotFoundError };
