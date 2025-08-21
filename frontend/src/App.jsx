import { useNavigate, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider.jsx";
import router from "./routes/routes.jsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useGameSocket } from "./hooks/useGameSocket.js";
import { useAuthStore } from "./stores/useAuthStore.js";

export default function App() {

  // socket.emit("getLastResults");
  const user = useAuthStore((s) => s.user);

  //  const { round, phase, result, bets, placeBet, messages, lastResults  } = useGameSocket(user?._id);
  // console.log({ round, phase, result, bets, placeBet, messages, lastResults  })
    
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-deepPurple">
        <RouterProvider router={router} />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthProvider>
  );
}
