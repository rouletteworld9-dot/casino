import { useState } from "react";
import InputField from "./ui/InputField";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/useAuthStore";
import Header from "./header";
import { toast } from "react-hot-toast";

const motionFade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  // transition: { duration: 0.5 },
};

export default function LoginScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const { loginUser, loginLoading } = useAuth();
  const user = useAuthStore((state) => state.user);
  if (user) return <Navigate to={`/${user?.role}`} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    if (!/^\d{10}$/.test(formData.phone) || formData.phone.length !== 10) {
      return toast.error("Please enter a valid phone number");
    }

    loginUser(formData, {
      onSuccess: (data) => {
        // If loginUser returns user details, use that, otherwise rely on store
        const loggedInUser = data?.user || useAuthStore.getState().user;

        if (loggedInUser?.role === "user") {
          navigate("/");
        } else {
          navigate("/admin/dashboard");
        }
      },
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <motion.div {...motionFade} className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400">Sign in to your casino account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
              minlength={10}
              maxlength={10}
                name="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              <InputField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <motion.button
                {...motionFade}
                // whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loginLoading}
                className="cursor-pointer w-full bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <motion.div {...motionFade} className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
                >
                  Register
                </button>
              </p>
              <p className="text-gray-400">
                Forgot Password?{" "}
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-purple-400 mt-3 hover:text-purple-300 font-medium transition-colors cursor-pointer"
                >
                  Click here
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
