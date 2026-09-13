// -----------------------------------------------------------------------------
// vite.config.js — Vite + React configuration
// -----------------------------------------------------------------------------
// The React plugin is essential here because this project uses JSX in .jsx
// files and uses the modern automatic JSX runtime.
//
// Without this plugin, the browser can receive code that expects a global
// `React` variable. That produces:
//     ReferenceError: React is not defined
//
// If the frontend suddenly becomes a blank page, check this file first.
// -----------------------------------------------------------------------------

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
  },
});
