// import React from "react";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AppContextProvider } from "./contexts/AppContext.tsx";
import { ToastContainer } from "react-toastify";
import { WSContextProvider } from "./contexts/WSContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <AppContextProvider>
      <WSContextProvider>
        <ToastContainer bodyClassName="font-kanit" />
        <App />
      </WSContextProvider>
    </AppContextProvider>
  // </React.StrictMode>
);
