import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/header";
import LandingPage from "./components/landing-page";
import LoginScreen from "./components/login";
import CasinoDashboard from "./pages/casino-game";
import RegisterScreen from "./components/register";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header onNavigate={(path) => navigate(`/${path}`)} />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/casino/game" element={<CasinoDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
