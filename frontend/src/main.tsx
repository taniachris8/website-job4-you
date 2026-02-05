import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AuthProvider } from "./services/AuthContext";
import { FilterProvider } from "./services/FilterContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <FilterProvider>
        <RouterProvider router={router} />
      </FilterProvider>
    </AuthProvider>
  </StrictMode>,
);
