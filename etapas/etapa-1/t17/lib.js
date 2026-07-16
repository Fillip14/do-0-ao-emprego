export const addTask = (tasks, title) => {
  // Chega array tasks e o title
  // Sai novo array com nova task title no final
  // title vazio, só espaços ou não-string → throw new Error('invalid title')
};

export const completeTask = (tasks, id) => {
  // Chega array tasks e o id
  // Sai novo array com o done da task do id invertido
  // id inexistente → throw new Error('task not found')
};

export const removeTask = (tasks, id) => {
  // Chega array tasks e o id
  // Sai novo array sem a task do id, pois ela foi removida
  // id inexistente → throw new Error('task not found')
};
