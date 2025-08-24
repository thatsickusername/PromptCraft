import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PromptGenerator from "./pages/createPromptPage/PromptGenerator";
import FrameworkEditor from "./pages/createFrameworkPage/FrameworkEditor";
import Home from "./pages/homePage/Home";
import SearchPage from "./pages/searchPage/searchPage";
import NotificationsPage from "./pages/notificationsPage/notificationsPage";
import type { Framework } from "./types";

export default function App() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Effect to show and hide the custom alert message
  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Function to add a new framework to the state
  const addFramework = (newFramework: Framework) => {
    if (newFramework.name && newFramework.text) {
      setFrameworks((prev) => [...prev, newFramework]);
      setAlertMessage(`Framework "${newFramework.name}" saved successfully!`);
    } else {
      setAlertMessage("Framework could not be saved. Please provide a name and text.");
    }
    // setActiveTab("prompts"); // This will be handled by routing
  };

  // Define the routes
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout alertMessage={alertMessage} showAlert={showAlert} />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "prompts",
          element: <PromptGenerator frameworks={frameworks} setAlertMessage={setAlertMessage} />,
        },
        {
          path: "frameworks",
          element: <FrameworkEditor onSave={addFramework} setAlertMessage={setAlertMessage} />,
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "notifications",
          element: <NotificationsPage />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    <RouterProvider router={router} />
  );
}
