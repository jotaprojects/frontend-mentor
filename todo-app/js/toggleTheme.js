// Toggle mode
import { readStorage, saveStorage } from "./storage";

// Store theme creates flashing when light theme is saved. 
// Create a loader? to avoid the flashing?

// Selectors
const toggleThemeBtn = document.querySelector('[data-toggle-theme]');
const htmlEl = document.documentElement;
const pictureEl = document.querySelector('.bg');

// Consts
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

// Storage Keys 
const KEY_THEME = 'theme';

const images = {
  dark: {
    lgScr: 'images/bg-desktop-dark.jpg',
    smScr: 'images/bg-mobile-dark.jpg'
  },
  light: {
    lgScr: 'images/bg-desktop-light.jpg',
    smScr: 'images/bg-mobile-light.jpg'
  }
}

export function setupTheme() {
  const savedTheme = readStorage(KEY_THEME);
  htmlEl.dataset.theme = savedTheme;

  toggleThemeBtn.addEventListener('click', () => {
    htmlEl.dataset.theme === DARK_THEME ? enableLightTheme() : enableDarkTheme();
  });
}

function enableDarkTheme() {
  htmlEl.dataset.theme = DARK_THEME;
  toggleThemeBtn.ariaLabel = 'Switch to dark mode';
  switchImgs(DARK_THEME);
  saveStorage(KEY_THEME, DARK_THEME);
}

function enableLightTheme() {
  htmlEl.dataset.theme = LIGHT_THEME;
  toggleThemeBtn.ariaLabel = 'Switch to light mode';
  switchImgs(LIGHT_THEME);
  saveStorage(KEY_THEME, LIGHT_THEME);
}

function switchImgs(theme) {
  pictureEl.querySelector('source').setAttribute('srcset', images[theme].lgScr);
  pictureEl.querySelector('img').setAttribute('src', images[theme].smScr);
}
