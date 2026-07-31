import { StrictMode } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

// Import the generated route tree
import { getRouter } from "./router";
import { Toaster } from "sonner";

// Create a new router instance
const router = getRouter();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Toaster
        position="top-right"
        duration={1500}
      />
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
