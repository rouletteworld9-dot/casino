import { useNavigate, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider.jsx";
import router from "./routes/routes.jsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function App() {
  return (
    <AuthProvider>
      <div className=" bg-deepPurple">
        <RouterProvider router={router} />
      </div>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </AuthProvider>
  );
}
