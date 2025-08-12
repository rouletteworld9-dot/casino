// src/routes.jsx
import { createBrowserRouter } from "react-router-dom";

// Public Pages
import LandingPage from "../components/landing-page.jsx";
import LoginScreen from "../components/login.jsx";
import RegisterScreen from "../components/register.jsx";

// Admin Pages

import AdminLayout from "../components/admin/AdminLayout.jsx";
import Dashboard from "../components/admin/Dashboard.jsx";
import Members from "../components/admin/Members.jsx";
import Games from "../components/admin/Games.jsx";
import LiveGame from "../components/admin/LiveGame.jsx";
import RechargeApprove from "../components/admin/RechargeApprove.jsx";
import Settings from "../components/admin/Settings.jsx";
import Transactions from "../components/admin/Transactions.jsx";
import Withdrawals from "../components/admin/Withdrawals.jsx";
import WithdrawalSettings from "../components/admin/WithdrawlsSettings.jsx";
import BrowseRecharge from "../components/admin/BrowseRecharge.jsx";
import UserLayout from "../components/user/UserLayout.jsx";
import UserProfile from "../components/user/UserProfile.jsx";
import UserBalance from "../components/user/UserBalance.jsx";
import UserHistory from "../components/user/UserHistory.jsx";
import CasinoDashboard from "../pages/casino-game.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Import } from "lucide-react";
import ForgetPassword from "../components/ForgotPassword.jsx";
import VerifyResetOtp from "../components/VerifyResetOtp.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
  {
    path: "/casino/game",
    element: <CasinoDashboard />,
  },
  {
    path: "/forgot-password",
    element: <ForgetPassword/>
  },
  {
    path: "/verify-reset-otp",
  element: <VerifyResetOtp/> 
},
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "members", element: <Members /> },
      { path: "games", element: <Games /> },
      { path: "transactions", element: <Transactions /> },
      { path: "browse-recharge", element: <BrowseRecharge /> },
      { path: "recharge-approve", element: <RechargeApprove /> },
      { path: "withdrawals", element: <Withdrawals /> },
      { path: "withdrawals-settings", element: <WithdrawalSettings /> },
      { path: "live-game", element: <LiveGame /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <UserProfile /> },
      { path: "deposits-withdrawals", element: <UserBalance /> },
      { path: "history", element: <UserHistory /> },
    ],
  },
]);
export default router;
