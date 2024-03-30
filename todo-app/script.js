import { setupTheme } from "./js/toggleTheme";
import { readStorage, saveStorage } from "./js/storage";
import { data } from "./data/mock";

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
const filterAll = filter.querySelector('#filter-all');
const btnClearCompleted = document.querySelector('[data-clear-completed]');
const listMsgEl = document.querySelector('[data-list-msg]');
const msg = {
  empty: "You are done with all your todos! 🙌",
  zeroResults: "No todos found."
};

let currentFilter = 'all';
let globalTodos = [];

setupTheme();
setupList();

function setupList() {
  // Only needed to set up mock data when no todos are saved.
  const storageTodos = readStorage('todos');
  globalTodos = storageTodos.length > 0 ? storageTodos : data;

  renderList();
}

// Create new todo
  // Handle empty values
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const todoValue = sanitizeInput(todoInput.value.trim());
  if (todoValue === '') return;

  runAction('add', {value: todoValue, status: todoCheckbox.checked});
  
  todoInput.value = '';
  todoCheckbox.checked = false;
});

btnClearCompleted.addEventListener('click', (e) => {
  if (globalTodos.length === 0) return;
  
  runAction('clear');
});

// Filter todos on status (All, Active, Completed)
filter.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  runAction(); // Runs empty to avoid running filterTodos twise
});

list.addEventListener('change', (e) => {
  if (!e.target.matches('[data-item-checkbox]')) return;

  const id = parseInt(e.target.closest('[data-item-id]').dataset.itemId);
  runAction('update', {id});
});

list.addEventListener('click', (e) => {
  // use of closest as matches is conflicting with svg inside button
  if (!e.target.closest('[data-remove]')) return;

  const id = parseInt(e.target.closest('[data-item-id]').dataset.itemId);
  runAction('delete', {id});
});

function renderList() {
  const items = filterTodos();
  list.innerHTML = '';

  hideMsg();
  updateItemsLeft();
  
  if (items.length > 0) {
    items.forEach(renderTodo);
  } else {
    showMsg(msg.zeroResults);
  }
  
  if (globalTodos.length === 0) {
    filterAll.checked = true;
    showMsg(msg.empty);
  }
}

function showMsg(msg) {
  listMsgEl.innerText = msg;
  listMsgEl.setAttribute('aria-hidden', false);
}

function hideMsg() {
  listMsgEl.innerText = '';
  listMsgEl.setAttribute('aria-hidden', true);
}

function renderTodo({ id, text, position, status}) {
  const cloneTemplate = itemTemplate.content.cloneNode(true);
  const liEl = cloneTemplate.querySelector('.list__item');
  const label = cloneTemplate.querySelector('[data-item-label]');
  const checkbox = cloneTemplate.querySelector('[data-item-checkbox]');
  
  liEl.dataset.itemId = id;
  label.innerText = text;
  label.setAttribute('for', `item-${id}`);
  checkbox.checked = status;
  checkbox.id = `item-${id}`;

  list.appendChild(cloneTemplate);
}

function filterTodos() {
  let filteredTodos = globalTodos;

  switch (currentFilter) {
    case 'active':
      filteredTodos = globalTodos.filter((todo) => todo.status === false);
      break;
    case 'completed':
      filteredTodos = globalTodos.filter((todo) => todo.status === true);
      break;
  }

  return filteredTodos;
}

// Update items left
function updateItemsLeft() {
  const left = globalTodos.filter((item) => item.status !== true);
  itemsLeft.innerText = left.length;
}

function runAction(action, args) {
  switch(action) {
    case 'add':
      addTodo(args);
      break;
    case 'update':
      updateTodo(args);
      break;
    case 'delete':
      deleteTodo(args);
      break;
    case 'clear':
      clearCompleted();
      break;
  }

  saveStorage('todos', globalTodos);
  renderList();
}

function getTodoId(childEl) {
  return childEl.closest('[data-item-id]').dataset.itemId;
}

function addTodo(args) {
  const {value, status} = args;
  const id = Date.now(); // Use uuid library in next iteration

  const todo = {
    id: id,
    text: value,
    position: 0,
    status: status
  };

  globalTodos.push(todo);
}

// Mark todo with completed
function updateTodo(args) {
  const {id} = args;
  const item = globalTodos.find((todo) => todo.id === id);

  if (item) {
    item.status = item.status ? false : true;
  }
}

// Remove a todo
function deleteTodo(args) {
  const {id} = args;
  globalTodos = globalTodos.filter((todo) => todo.id !== id);
}

// Clear all todos
function clearCompleted() {
  globalTodos = globalTodos.filter((todo) => todo.status === false);
}

// Simple encoding input value 
// Check https://github.com/cure53/DOMPurify for future
function sanitizeInput(value) {
  return encodeURI(value.toWellFormed());
}
