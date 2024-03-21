import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  base: "./",
  publicDir: "assets/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        "newsletter-sign-up": resolve(__dirname, 'newsletter-sign-up/index.html'),
        "todo-app": resolve(__dirname, 'todo-app/index.html')
      }
    },
    outDir: "dist/"
  }
});
