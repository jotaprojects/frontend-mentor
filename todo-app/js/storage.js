const PREFIX = 'TODO-';
export const todoKey = 'todos';
const themeKey = 'theme';

// Make use of the const above and not the param.

export function readStorage(key) {
  return JSON.parse(localStorage.getItem(PREFIX + key)) || [];
}

export function saveStorage(key, data) {
  localStorage.setItem(PREFIX + key, JSON.stringify(data));
}
