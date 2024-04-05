const PREFIX = 'TODO-';

export function readStorage(key) {
  return JSON.parse(localStorage.getItem(PREFIX + key)) || [];
}

export function saveStorage(key, data) {
  localStorage.setItem(PREFIX + key, JSON.stringify(data));
}
