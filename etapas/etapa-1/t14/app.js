const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

const renderTask = (text) => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const doneBtn = document.createElement('button');
  const removeBtn = document.createElement('button');

  span.textContent = text;
  span.className = 'title';
  doneBtn.textContent = 'done';
  doneBtn.className = 'done';
  removeBtn.textContent = 'x';
  removeBtn.className = 'remove';

  doneBtn.addEventListener('click', () => li.classList.toggle('completed'));
  removeBtn.addEventListener('click', () => li.remove());

  li.appendChild(span);
  li.appendChild(doneBtn);
  li.appendChild(removeBtn);

  return li;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value;
  if (text.trim() === '') return;

  const newLi = renderTask(text);

  taskList.appendChild(newLi);
  taskInput.value = '';
  taskInput.focus();
});
