// { id: number, title: string, done: boolean }

export const addTask = (tasks, title) => {
  if (title.trim() === '') throw new Error('invalid title');
  const listTasks = structuredClone(tasks);
  const newTask = {};

  newTask.id = tasks.length > 1 ? tasks.at(-1)[0] + 1 : 1;
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
  // const task = tasks.find((task) => task.id === id);
  // if (!task) throw new Error('task not found');
  // const listTasks = structuredClone(tasks);
  // listTasks.filter((task) => {
  //   console.log(task.id, id);
  //   task.id !== id;
  // });
  // console.log(listTasks);
  // Chega array tasks e o id
  // Sai novo array sem a task do id, pois ela foi removida
  // id inexistente → throw new Error('task not found')
};
