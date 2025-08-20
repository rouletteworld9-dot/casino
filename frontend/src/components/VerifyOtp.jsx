import React, { useState } from "react";
import OtpTimer from "./ui/OtpTimer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const VerifyOtp = ({ phone, resendOtp }) => {
  const navigate = useNavigate();
  const { verifyOtpFn } = useAuth();
  const [codeSent, setCodeSent] = useState(false);
  const [timerKey, setTimerKey] = useState(Date.now());
  const [timerExpired, setTimerExpired] = useState(false);
  const handleResend = () => {
    if (!timerExpired) return;
    resendOtp();
    // Here you would call your resend OTP API
    setTimerKey(Date.now());
    setTimerExpired(false);
  };
  const [verificationCode, setVerificationCode] = useState("");

  const handleCodeSubmit = () => {
    if (verificationCode.length < 4) {
      toast.error("Please enter a valid verification code");
      return;
    }
    verifyOtpFn(
      { phone, otp: verificationCode },
      {
        onSuccess: () => {
          navigate("/login");
        },
      }
    );
  };

  return (
    <div className="py-10">
      <p className="text-sm text-white font-semibold">
        Verify YOUR PHONE NUMBER
      </p>
      <p className="text-sm text-gray-400 mb-2">
        A text message with a confirmation code was sent to{" "}
      </p>
      <p className="text-xs underline text-purple-400 mb-4">
        Are you not getting a confirmation code?
      </p>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
          className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400"
        />
        <OtpTimer
          durationMs={60000}
          keyTrigger={timerKey}
          onExpire={() => setTimerExpired(true)}
        />
      </div>

      <button
        onClick={handleCodeSubmit}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-bold transition cursor-pointer"
      >
        Next
      </button>

      <div className="flex flex-col gap-2 mt-2">
        <button
          className={`text-blue-400 underline text-sm transition-opacity cursor-pointer ${!timerExpired ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleResend}
          disabled={!timerExpired}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
