import { setupTheme } from "./js/toggleTheme";

setupTheme();

// Save todos in some storage
// Read todos from storage
  // FIXME: The List chould not be visible if there are no todos when starting application
// Filter todos on status (All, Active, Completed)

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

let todos = [];

// Create new todo
  // Handle empty values
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const todoValue = todoInput.value;
  if (todoValue === '') return;

  const status = todoCheckbox.checked;
  const id = Date.now(); // Use uuid library in next iteration

  const todo = {
    id: id,
    text: todoValue,
    position: 0,
    status: status
  };

  todos.push(todo);

  todoInput.value = '';
  todoCheckbox.checked = false;

  renderList(todos);
});

btnClearCompleted.addEventListener('click', (e) => {
  console.log('btnClearCompleted', todos.length)
  if (todos.length === 0) return;
  clearCompleted();
  
  // TODO Might be good to only remove the element from the DOM instead of rerender?
  renderList(todos);
});

filter.addEventListener('change', (e) => {
  const currentFilter = e.target.value;
  let filteredTodos = todos;

  //FIXME: If there are no active or no completed todos the list is hidden. 
  // This should not happen. Suggest: Don't call renderList and 
  // let the user know that no todos were found (toast message?).
  switch (currentFilter) {
    case 'active':
      filteredTodos = todos.filter((todo) => todo.status === false);
      break;
    case 'completed':
      filteredTodos = todos.filter((todo) => todo.status === true);
      break;
  }

  renderList(filteredTodos);
});

// Don't show the list or filter when there are no todos
  // .main-body (hide with css)
function renderList(items) {
  if (items.length > 0) {
    list.innerHTML = '';
    items.forEach(renderTodo);
    updateItemsLeft();
    
    showList();
  } else {
    filterAll.checked = true; // Is this the best place to reset filter?
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
  const label = cloneTemplate.querySelector('[data-item-label]');
  const checkbox = cloneTemplate.querySelector('[data-item-checkbox]');
  
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
  if (!e.target.matches('[data-item-checkbox]')) return;

  const id = e.target.closest('[data-item-id]').dataset.itemId;

  updateTodo(parseInt(id));
  updateItemsLeft();
})

list.addEventListener('click', (e) => {
  // use of closest as matches is conflicting with svg inside button
  if (!e.target.closest('[data-remove]')) return;

  const id = e.target.closest('[data-item-id]').dataset.itemId;
  removeTodo(parseInt(id));

  // TODO Might be good to only remove the element from the DOM instead of rerender?
  renderList(todos);
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

// Clear all todos
function clearCompleted() {
  todos = todos.filter((todo) => todo.status === false);
}
