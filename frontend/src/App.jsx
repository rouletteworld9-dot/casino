import { useNavigate, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider.jsx";
import router from "./routes/routes.jsx";
export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-deepPurple">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}
