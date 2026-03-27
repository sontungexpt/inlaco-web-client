import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router";
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
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        {/* Reset CSS to default */}
        <CssBaseline>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </CssBaseline>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
