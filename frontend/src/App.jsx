import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/header";
import Footer from "./components/footer.jsx";
import RegisterScreen from "./components/register";
import LandingPage from "./components/landing-page";
import LoginScreen from "./components/login";
import CasinoDashboard from "./pages/casino-game";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import Members from "./components/admin/Members.jsx";
import BrowseRecharge from "./components/admin/BrowseRecharge.jsx";
import RechargeApprove from "./components/admin/RechargeApprove.jsx";
import Withdrawals from "./components/admin/Withdrawals.jsx";
import WithdrawlsSettings from "./components/admin/WithdrawlsSettings.jsx";
import LiveGame from "./components/admin/LiveGame.jsx";
import Settings from "./components/admin/Settings.jsx";
// import Games from "./components/admin/Games.jsx";
import Transactions from "./components/admin/Transactions.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import VerifyResetOtp from "./components/VerifyResetOtp.jsx";
// import { useAuthStore } from "./stores/useAuthStore.js";
import { AuthProvider } from "./components/auth/AuthProvider.jsx";

export default function App() {
  const navigate = useNavigate();

  return (
    <AuthProvider>
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="members" element={<Members />} />
                {/* <Route path="games" element={<Games />} /> */}
                <Route path="transactions" element={<Transactions />} />
                <Route path="browse-recharge" element={<BrowseRecharge />} />
                <Route path="recharge-approve" element={<RechargeApprove />} />
                <Route path="withdrawals" element={<Withdrawals />} />
                <Route
                  path="withdrawals-settings"
                  element={<WithdrawlsSettings />}
                />
                <Route path="live-game" element={<LiveGame />} />
                <Route path="settings" element={<Settings />} />
                <Route path="" element={<Navigate to="dashboard" />} />
              </Route>
              {/* <Route path="*" element={<Navigate to="/" />} /> */}
            </Routes>
          </motion.main>
        </AnimatePresence>
        <Footer/>
      </div>
    </AuthProvider>
  );
}
