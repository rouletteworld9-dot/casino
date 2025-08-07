import { useState } from "react";
import InputField from "./ui/InputField";
import { useNavigate } from "react-router-dom";
import VerifyOtp from "./VerifyOtp";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!agreeToTerms) return alert("Please agree to the terms and conditions");

    setIsLoading(true);
    setTimeout(() => {
      console.log("Registration successful:", formData);
      setIsLoading(false);
      setCodeSent(true); // Show verification section
    }, 1000);
  };

  const handleCodeSubmit = () => {
    if (verificationCode.length < 4) {
      alert("Please enter a valid verification code");
      return;
    }
    // Simulate verification
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#482D60] via-[#412C4D] to-[#19161A] flex">
      {/* Left Side - Image */}
      <div className="relative flex-1 flex items-center justify-center p-2 overflow-hidden">
        <img src="./registerbg.webp" alt="Background" className="object-contain w-full h-full absolute top-0 left-0" />
        <div className="relative top-30 z-10 text-white text-center max-w-[100%]">
          <p className="text-3xl font-semibold text-yellow-400">WELCOME PACK</p>
          <h1 className="text-7xl font-extrabold text-yellow-300 my-2">500% + 430 FS</h1>
          <p className="text-2xl font-semibold text-white">UP TO 150 000 INR</p>
        </div>
       
      </div>

      {/* Right Side - Registration + Code Verification */}
      <div className="w-[40%] bg-gray-900/95 backdrop-blur-lg border-l border-purple-500/30 flex items-center justify-center px-8 py-2">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Registration</h2>
            <p className="text-gray-400 text-sm mt-1">Create your account now</p>
          </div>

          <div className="space-y-4">
            {/* Phone Input */}
            <InputField
              type="tel"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
            <p className="text-xs text-gray-400 mt-1">A verification code will be sent to this number.</p>

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
                <button className="text-purple-400 underline">Privacy Policy</button>,{" "}
                <button className="text-purple-400 underline">Betting Rules</button> and confirm I’m over 18.
              </span>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Register"
              )}
            </button>
             <p className="text-sm text-center mt-3 text-gray-400">
                Already have an account?{" "}
                <button onClick={() => navigate("/login")} className="text-purple-400 underline">
                  Log in
                </button>
              </p>
          </div>

          {/* Verification Section */}
          {codeSent && (
            <VerifyOtp/>
          )}
        </div>
      </div>
    </div>
  );
}
