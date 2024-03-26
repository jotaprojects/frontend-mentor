import { setupTheme } from "./js/toggleTheme";

setupTheme();

// Save todos in some storage
// Read todos from storage
// Filter todos on status (All, Active, Completed)
// Clear all todos

// Update todo (?)
// Drag'n'drop to reorder todos (?)

const form = document.querySelector('#todo-form');
const todoCheckbox = form.querySelector('#todo-checkbox');
const todoInput = form.querySelector('#todo-input');
const mainBody = document.querySelector('.main-body');
const mainFoot = document.querySelector('.main-foot');
const list = document.querySelector('[data-list]');
const itemTemplate = document.querySelector('#item-template');
const itemsLeft = document.querySelector('[data-items-left]');
const filter = document.querySelector('[data-filter]');

let todos = [];

// When todos are empty do I need to reset the generator?
// How to handle this when we save/load todos in storage
function* idGenerator() {
  let count = 1;

  while(true) {
    yield count++;
  }
}

const generator = idGenerator();

// Create new todo
  // Handle empty values
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const todoValue = todoInput.value;
  if (todoValue === '') return;

  const status = todoCheckbox.checked;
  const id = generator.next();

  const todo = {
    id: id.value,
    text: todoValue,
    position: 0,
    status: status
  };

  todos.push(todo);

  todoInput.value = '';
  todoCheckbox.checked = false;

  renderList();
});

// Don't show the list or filter when there are no todos
  // .main-body (hide with css or )
function renderList() {
  if (todos.length > 0) {
    list.innerHTML = '';
    todos.reverse();
    todos.forEach(renderTodo);
    updateItemsLeft();

    showList();
  } else {
    hideList();
  }
}

function showList() {
  mainBody.classList.remove('invisible');
  mainFoot.classList.remove('invisible');
}

function hideList() {
  mainBody.classList.add('invisible');
  mainFoot.classList.add('invisible');
}

function renderTodo({ id, text, position, status}) {
  const cloneTemplate = itemTemplate.content.cloneNode(true);
  const liEl = cloneTemplate.querySelector('.list__item');
  const label = cloneTemplate.querySelector('label');
  const checkbox = cloneTemplate.querySelector('[type="checkbox"]');
  
  liEl.dataset.itemId = id;
  label.innerText = text;
  label.setAttribute('for', `item-${id}`);
  checkbox.checked = status;
  checkbox.id = `item-${id}`;

  list.appendChild(cloneTemplate);
}

// Update items left
function updateItemsLeft() {
  const left = todos.filter((item) => item.status !== true);
  itemsLeft.innerText = left.length;
}

list.addEventListener('change', (e) => {
  const id = e.target.closest('[data-item-id]').dataset.itemId;

  updateTodo(parseInt(id));
  updateItemsLeft();
})

list.addEventListener('click', (e) => {
  // use of closest as matches is conflicting with svg inside button
  if (!e.target.closest('[data-remove]')) return;

  const id = e.target.closest('[data-item-id]').dataset.itemId;
  removeTodo(parseInt(id));

  renderList();
});

// Mark todo with completed
function updateTodo(id) {
  const item = todos.find((todo) => todo.id === id);

  if (item) {
    item.status = item.status ? false : true;
  }
}

// Remove a todo
function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
}
