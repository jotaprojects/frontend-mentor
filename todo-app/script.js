import { setupTheme } from "./js/toggleTheme";
import { readStorage, saveStorage } from "./js/storage";
import { data } from "./data/mock";

// Update todo (?)

// Selectors
const form = document.querySelector('#todo-form');
const todoCheckbox = form.querySelector('#todo-checkbox');
const todoInput = form.querySelector('#todo-input');
const list = document.querySelector('[data-list]');
const itemTemplate = document.querySelector('#item-template');
const itemsLeft = document.querySelector('[data-items-left]');
const filter = document.querySelector('[data-filter]');
const filterAll = filter.querySelector('#filter-all');
const btnClearCompleted = document.querySelector('[data-clear-completed]');
const listMsgEl = document.querySelector('[data-list-msg]');

// Actions
const TODO_ADD = 'add';
const TODO_UPDATE = 'update';
const TODO_DELETE = 'delete';
const TODO_CLEAR = 'clear';

// Filters
const FILTER_ALL = 'all';
const FILTER_ACTIVE = 'active';
const FILTER_COMPLETED = 'completed';

// Storage Keys
const KEY_TODO = 'todos';

const listItemIdAttr = '[data-item-id]';
const msg = {
  empty: "You are done with all your todos! 🙌",
  zeroResults: "No todos found."
};

let currentFilter = FILTER_ALL;
let globalTodos = [];

setupTheme();
setupList();

function setupList() {
  // Only needed to set up mock data when no todos are saved.
  const storageTodos = readStorage(KEY_TODO);
  globalTodos = storageTodos.length > 0 ? storageTodos : data;

  renderList();
}

// Create new todo
  // Handle empty values
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const todoValue = sanitizeInput(todoInput.value.trim());
  if (todoValue === '') return;

  runAction(TODO_ADD, { value: todoValue, status: todoCheckbox.checked });
  
  todoInput.value = '';
  todoCheckbox.checked = false;
});

btnClearCompleted.addEventListener('click', (e) => {
  if (globalTodos.length === 0) return;
  
  runAction(TODO_CLEAR);
});

// Filter todos on status (All, Active, Completed)
filter.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  runAction(); // Runs empty to avoid running filterTodos twise
});

list.addEventListener('change', (e) => {
  if (!e.target.matches('[data-item-checkbox]')) return;

  const id = getTodoIdFromTarget(e.target)
  if (id !== null) {
    runAction(TODO_UPDATE, { id });
  }
});

list.addEventListener('click', (e) => {
  // use of closest as matches is conflicting with svg inside button
  if (!e.target.closest('[data-remove]')) return;

  const id = getTodoIdFromTarget(e.target);
  if (id !== null) {
    runAction(TODO_DELETE, { id });
  }
});

function renderList() {
  const items = filterTodos();
  items.sort((a, b) => a.position - b.position);
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
  liEl.setAttribute('draggable', true);
  label.innerText = text;
  label.setAttribute('for', `item-${id}`);
  checkbox.checked = status;
  checkbox.id = `item-${id}`;

  list.appendChild(cloneTemplate);
}

function filterTodos() {
  switch (currentFilter) {
    case FILTER_ACTIVE:
      return globalTodos.filter((todo) => !todo.status);
    case FILTER_COMPLETED:
      return globalTodos.filter((todo) => todo.status);
    default:
      return globalTodos;
  }
}

// Update items left
function updateItemsLeft() {
  // accumulator (integer)
  const left = globalTodos.reduce((count, item) => count + (item.status !== true ? 1 : 0), 0);
  itemsLeft.innerText = left;
}

function runAction(action, args) {
  switch (action) {
    case TODO_ADD:
      addTodo(args);
      break;
    case TODO_UPDATE:
      updateTodo(args);
      break;
    case TODO_DELETE:
      deleteTodo(args);
      break;
    case TODO_CLEAR:
      clearCompleted();
      break;
  }

  saveStorage(KEY_TODO, globalTodos);
  renderList();
}

function getTodoIdFromTarget(target) {
  const itemEl = target.closest(listItemIdAttr);
  return itemEl ? parseInt(itemEl.dataset.itemId) : null;
}

function addTodo({ value, status }) {
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
function updateTodo({ id }) {
  const todoItem = globalTodos.find((todo) => todo.id === id);

  if (todoItem) {
    todoItem.status = !todoItem.status;
  }
}

// Remove a todo
function deleteTodo({ id }) {
  globalTodos = globalTodos.filter((todo) => todo.id !== id);
}

// Clear all todos
function clearCompleted() {
  globalTodos = globalTodos.filter((todo) => !todo.status);
}

// Simple encoding input value 
// Check https://github.com/cure53/DOMPurify for future
function sanitizeInput(value) {
  return encodeURI(value.toWellFormed());
}

// Drag'n'drop to reorder todos
// Note drag'n'drop API does not support touch.
let draggedItem = null;

list.addEventListener('dragstart', (e) => {
  draggedItem = e.target;
  e.dataTransfer.setData('text/plain', '');
  e.target.classList.add('dragging');
});

list.addEventListener('dragover', (e) => {
  e.preventDefault(); // Allow drop
  const targetItem = e.target.closest(listItemIdAttr);
  targetItem.classList.add('dropping');
  if (targetItem && targetItem !== draggedItem) {
    if (!targetItem.previousElementSibling) {
      list.insertBefore(draggedItem, list.firstChild);
    } else {
      list.insertBefore(draggedItem, targetItem.nextSibling); // Move dragged to new position
    }
  }
});

list.addEventListener('dragenter', (e) => {
  e.preventDefault();
  const targetItem = e.target.closest(listItemIdAttr); 
  targetItem.classList.add('dropping');
});

list.addEventListener('dragleave', preventDragDefault);
list.addEventListener('drop', preventDragDefault);

list.addEventListener('dragend', (e) => {
  e.target.classList.remove('dragging');
  draggedItem = null;
  updatePositions();
});

function preventDragDefault(e) {
  e.preventDefault();
  const targetItem = e.target.closest(listItemIdAttr);
  targetItem.classList.remove('dropping');
}

function updatePositions() {
  const listItems = list.querySelectorAll(listItemIdAttr);
  const itemIds = Array.from(listItems).map(li => {
    const id = parseInt(li.dataset.itemId);
    if (isNaN(id)) {
      throw new Error('Invalid item ID found');
    }
    return id;
  });
  // accumulator (empty object), currentValue, currentIndex
  const idToPosition = itemIds.reduce((acc, id, index) => {
    acc[id] = index;
    return acc;
  }, {});

  globalTodos.forEach(todo => {
    if (idToPosition.hasOwnProperty(todo.id)) {
      todo.position = idToPosition[todo.id];
    } else {
      throw new Error(`Todo with ID ${todo.id} not found in the list.`);
    }
  });

  saveStorage(KEY_TODO, globalTodos);
}
