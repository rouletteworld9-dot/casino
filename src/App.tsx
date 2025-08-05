"use client";

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
import RegisterScreen from "./components/register";
import LandingPage from "./components/landing-page";
import Footer from "./components/footer";
import LoginScreen from "./components/login";
import CasinoGame from "./pages/casino-game";

export default function CasinoApp() {

  const navigate= useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleRegister = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  return (
 
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          onNavigate={(path) => navigate(`/${path}`)}
        />
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <Routes>
              <Route
                path="/"
                element={<LandingPage isLoggedIn={isLoggedIn} />}
              />
              <Route
                path="/login"
                element={
                  <LoginScreen
                    onLogin={handleLogin}
                    onSwitchToRegister={() =>
                      (window.location.href = "/register")
                    }
                  />
                }
              />
              <Route
                path="/register"
                element={
                  <RegisterScreen
                    onRegister={handleRegister}
                    onSwitchToLogin={() => (window.location.href = "/login")}
                  />
                }
              />
              <Route path="/casino/game" element={<CasinoGame/>}/>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
  );
}
