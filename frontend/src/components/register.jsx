import { useState } from "react";
import InputField from "./ui/InputField";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import VerifyOtp from "./VerifyOtp";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const { registerUser, registerLoading } = useAuth();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    if (!/^\+91\d{10}$/.test(formData.phone)  || formData.phone.length !== 13) {
      return toast.error("Please enter a valid phone number");
    }
    if (!agreeToTerms) return toast.error("Please agree to the terms and conditions");
    registerUser(formData, {
      onSuccess: () => {
        setCodeSent(true);
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#482D60] via-[#412C4D] to-[#19161A] flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden h-[300px] sm:h-[500px] lg:h-auto">
        <img
          src="./registerbg.webp"
          alt="Background"
          className="object-cover w-full h-full absolute top-0 left-0"
        />
        <div className="relative z-10 text-white text-center px-4">
          <p className="text-xl sm:text-3xl font-semibold text-yellow-400">
            WELCOME PACK
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-yellow-300 my-2">
            500% + 430 FS
          </h1>
          <p className="text-lg sm:text-2xl font-semibold text-white">
            UP TO 150 000 INR
          </p>
        </div>
      </div>

      {/* Right Side - Registration + Code Verification */}
      <div className="w-full lg:w-[40%] bg-gray-900/95 backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-purple-500/30 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Registration
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Create your account now
            </p>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <InputField
              type="text"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            {/* Phone */}
            <InputField
              type="tel"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
            <p className="text-xs text-gray-400 mt-1">
              A verification code will be sent to this number.
            </p>

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* Terms */}
            <div className="flex items-start gap-3 text-xs text-gray-400">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 bg-gray-800 border-gray-600 rounded"
              />
              <span>
                I agree to{" "}
                <button className="text-purple-400 underline">Terms</button>,{" "}
                <button className="text-purple-400 underline">
                  Privacy Policy
                </button>
                ,{" "}
                <button className="text-purple-400 underline">
                  Betting Rules
                </button>{" "}
                and confirm I’m over 18.
              </span>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={registerLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {registerLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Register"
              )}
            </button>

            {/* Login Redirect */}
            <p className="text-sm text-center mt-3 text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-purple-400 underline"
              >
                Log in
              </button>
            </p>
          </div>

          {/* OTP Verification */}
          {codeSent && <VerifyOtp phone={formData.phone} />}
        </div>
      </div>
    </div>
  );
}
