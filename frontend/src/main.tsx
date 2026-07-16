import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from "./App.tsx";
import Register from "./view/pages/Register.tsx";
import NotFound from "./view/pages/NotFound.tsx";
import React from "react";
import Login from "./view/pages/Login.tsx";
import Home from "./view/pages/Home.tsx";
import UploadFile from "./view/pages/UploadFile.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "upload",
                element: <UploadFile />,
            },
        ],
    },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <React.StrictMode>
          <RouterProvider router={router} />
      </React.StrictMode>
  </StrictMode>,
)
