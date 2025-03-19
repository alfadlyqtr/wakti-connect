
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "@/components/ui/toaster";
import { NotificationListener } from "@/components/notifications/NotificationListener";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <NotificationListener />
    </>
  );
}

export default App;
