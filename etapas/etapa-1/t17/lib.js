export const addTask = (tasks, title) => {
  if (title.trim() === '') throw new Error('invalid title');
  const listTasks = structuredClone(tasks);
  const newTask = {};

  newTask.id = tasks.length > 0 ? tasks.at(-1).id + 1 : 1;
  newTask.title = title;
  newTask.done = false;

  listTasks.push(newTask);

  return listTasks;
};

export const completeTask = (tasks, id) => {
  const task = tasks.find((task) => task.id === id);
  if (!task) throw new Error('task not found');

  const listTasks = structuredClone(tasks);

  listTasks.find((task) => {
    if (task.id === id) task.done = task.done ? false : true;
  });

  return listTasks;
};

export const removeTask = (tasks, id) => {
  const task = tasks.find((task) => task.id === id);
  if (!task) throw new Error('task not found');

  const listTasks = structuredClone(tasks.filter((task) => task.id !== id));

  return listTasks;
};
