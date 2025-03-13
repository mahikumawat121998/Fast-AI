import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"; 
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/HomePage.jsx";
import ChatPage from "./routes/ChatPage/ChatPage.jsx";
import RootLayout from "./layouts/rootLayout/RootLayout.jsx";
import DashBoardLayout from "./layouts/DashBoardLayout/DashBoardLayout.jsx";
import SignInPage from "./routes/SignInPage/SignInPage.jsx";
import SignUpPage from "./routes/SignUpPage/SignUpPage.jsx";
import DashBoardPage from "./routes/dashboardPage/DashboardPage.jsx";
 
const queryClient = new QueryClient();
const router = createBrowserRouter([
 
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },

      {
        path: "/dashboard",
        element: <DashBoardLayout />,
        children: [
          { path: "/dashboard", element: <DashBoardPage /> },
          { path: "/dashboard/chats/:id", element: <ChatPage /> },
        ],
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
