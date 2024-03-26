// Toggle mode
// Store chosen theme in storage (?)
const toggleThemeBtn = document.querySelector('[data-toggle-theme]');
const htmlEl = document.documentElement;

export function setupTheme() {
  toggleThemeBtn.addEventListener('click', () => {
    htmlEl.dataset.theme === 'dark' ? enableLightTheme() : enableDarkTheme();
  });
}

function enableDarkTheme() {
  htmlEl.dataset.theme = 'dark';
  toggleThemeBtn.ariaLabel = 'Switch to dark mode';
}

function enableLightTheme() {
  htmlEl.dataset.theme = 'light';
  toggleThemeBtn.ariaLabel = 'Switch to light mode';
}
