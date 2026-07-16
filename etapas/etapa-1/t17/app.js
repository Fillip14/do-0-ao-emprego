import { completeTask, removeTask, addTask } from './lib.js';

const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const divError = document.querySelector('#error');

const renderTask = () => {
  const tasks = loadTasks();
  taskList.replaceChildren();

  for (const task of tasks) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const doneBtn = document.createElement('button');
    const removeBtn = document.createElement('button');

    taskList.appendChild(li);
    li.appendChild(span);
    li.appendChild(doneBtn);
    li.appendChild(removeBtn);

    span.textContent = task.title;
    span.className = 'title';

    if (task.done === true) li.classList.toggle('completed');
    doneBtn.textContent = 'done';
    doneBtn.className = 'done';
    removeBtn.textContent = 'x';
    removeBtn.className = 'remove';

    doneBtn.addEventListener('click', () => {
      const newList = completeTask(tasks, task.id);
      saveTasks(newList);
      renderTask();
    });

    removeBtn.addEventListener('click', () => {
      const newList = removeTask(tasks, task.id);
      saveTasks(newList);
      renderTask();
    });
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = taskInput.value;
  const tasks = loadTasks();

  try {
    divError.textContent = '';
    const listTasks = addTask(tasks, title);
    saveTasks(listTasks);
    renderTask();
  } catch (err) {
    divError.textContent = err.message;
  }

  taskInput.value = '';
  taskInput.focus();
});

const loadTasks = () => {
  let tasksRead = [];
  try {
    tasksRead = JSON.parse(localStorage.getItem('tasks'));
  } catch (err) {
    return [];
  }
  if (tasksRead === null) return [];
  return tasksRead;
};

const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

renderTask();
