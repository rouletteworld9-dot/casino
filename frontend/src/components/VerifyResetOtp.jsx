import React, { useState } from "react";
import OtpTimer from "./ui/OtpTimer";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPhone = location?.state?.phone || "";
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, resetPasswordLoading, forgotPassword, forgotPasswordLoading } = useAuth();
  const [timerKey, setTimerKey] = useState(Date.now());

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !otp || !newPassword || !confirmPassword) return toast.error(error?.response?.data?.message || "Fill all fields");
    if (newPassword !== confirmPassword) return toast.error(error?.response?.data?.message || "Passwords do not match");

    resetPassword(
      { phone, otp, newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successful. Please login.");
          navigate("/login");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Password reset failed");
        },
      }
    );
  };

  const resend = async () => {
    if (!phone) return toast.error( error?.response?.data?.message || "Enter phone number");
    forgotPassword(
      { phone },
      {
        onSuccess: () => {
          toast.success("OTP resent");
          setTimerKey(Date.now()); // reset timer
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to resend OTP");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <motion.div {...fade} className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-gray-400">Enter OTP and new password</p>
          </motion.div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +15551234567"
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">OTP</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <OtpTimer
                  durationMs={60000}
                  keyTrigger={timerKey}
                  onExpire={() => {}}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <motion.button
              {...fade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={resetPasswordLoading}
              className="w-full bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-purple-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {resetPasswordLoading ?  (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
            </motion.button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm">
            <button
              onClick={resend}
              disabled={forgotPasswordLoading}
              className="text-blue-400 hover:text-blue-300 disabled:opacity-50 cursor-pointer"
            >
              {forgotPasswordLoading ? "Resending..." : "Resend Code"}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-400 hover:text-gray-200 cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


