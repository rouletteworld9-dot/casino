import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const { forgotPassword, forgotPasswordLoading } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error("Enter phone number");
    
    forgotPassword(
      { phone },
      {
        onSuccess: () => {
          navigate("/verify-reset-otp", { state: { phone } });
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to send OTP");
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
              Forgot Password
            </h1>
            <p className="text-gray-400">Enter your phone to receive an OTP</p>
          </motion.div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <motion.button
              {...fade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={forgotPasswordLoading}
              className="w-full bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-purple-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {forgotPasswordLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send OTP"
              )}
            </motion.button>
          </form>

          <motion.div {...fade} className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-400 hover:text-gray-200 cursor-pointer"
            >
              Back to Login
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
