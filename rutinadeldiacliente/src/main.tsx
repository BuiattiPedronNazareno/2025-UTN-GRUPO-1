import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App.tsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import "./styles/main.scss";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4A90A4",
    },
    secondary: {
      main: "#8FBC8F",
    },
    background: {
      default: "#B8D4D6",
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
  },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider> 
          <App />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);
