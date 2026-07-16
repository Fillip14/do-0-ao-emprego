export const addTask = (tasks, title) => {
  if (typeof title !== 'string' || title.trim() === '') throw new Error('invalid title');
  const listTasks = structuredClone(tasks);
  const newTask = {};

  const maxId = listTasks.reduce((acc, task) => {
    if (task.id > acc) return task.id;
    return acc;
  }, 0);

  newTask.id = maxId + 1;
  newTask.title = title;
  newTask.done = false;

  listTasks.push(newTask);

  return listTasks;
};

export const completeTask = (tasks, id) => {
  const task = tasks.find((task) => task.id === id);
  if (!task) throw new Error('task not found');

  return tasks.map((task) => {
    if (task.id === id) task.done = task.done ? false : true;
    return task;
  });
};

export const removeTask = (tasks, id) => {
  const task = tasks.find((task) => task.id === id);
  if (!task) throw new Error('task not found');

  return tasks.filter((task) => task.id !== id);
};
