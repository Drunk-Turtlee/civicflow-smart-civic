// -----------------------------------------------------------------------------
// main.jsx
// -----------------------------------------------------------------------------
// This is the entry point of the React application.
// It creates the React root and wraps the application with the providers that
// the rest of the project needs:
//
// 1. I18nextProvider  -> makes translations available everywhere.
// 2. ThemeProvider    -> provides the Material UI design system.
// 3. BrowserRouter    -> enables client-side page navigation without full reloads.
//
// Backend developers normally do NOT need to modify this file.
// -----------------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import i18n from "./i18n/i18n";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#315f8c" },
    secondary: { main: "#6d5dfc" },
    success: { main: "#2e8b72" },
    warning: { main: "#d58b32" },
    error: { main: "#c94b59" },
    background: { default: "#e7edf4", paper: "#e7edf4" },
    text: { primary: "#233044", secondary: "#66758a" }
  },
  typography: {
    fontFamily: '"Inter", "Noto Sans Devanagari", "Noto Sans", system-ui, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.04em" },
    h2: { fontWeight: 800, letterSpacing: "-0.035em" },
    h3: { fontWeight: 750, letterSpacing: "-0.025em" },
    button: { textTransform: "none", fontWeight: 700 }
  },
  shape: { borderRadius: 18 }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);