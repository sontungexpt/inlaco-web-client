import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router";
import { AuthProvider } from "@/contexts/auth.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { CssBaseline } from "@mui/material";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <BrowserRouter> */}
      {/* NOTE: Temporary use HashRouter for easier deploy to gh-pages */}
      <HashRouter>
        {/* Reset CSS to default */}
        <CssBaseline>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </CssBaseline>
      </HashRouter>
      {/* </BrowserRouter> */}
    </QueryClientProvider>
  </React.StrictMode>,
);
