import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
    const navigate = useNavigate()
      const [codeSent, setCodeSent] = useState(false); // Track if code is sent
      const [verificationCode, setVerificationCode] = useState("");

        const handleCodeSubmit = () => {
    if (verificationCode.length < 4) {
      alert("Please enter a valid verification code");
      return;
    }
    // Simulate verification
    setTimeout(() => {
      navigate("/home");
    }, 500);
  };

  return (
        <div className="py-10">
              <p className="text-sm text-white font-semibold">CONFIRM YOUR PHONE NUMBER</p>
              <p className="text-sm text-gray-400 mb-2">
                A text message with a confirmation code was sent to{" "}
              </p>
              <p className="text-xs underline text-purple-400 mb-4">Are you not getting a confirmation code?</p>

              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4"
              />

              <button
                onClick={handleCodeSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-bold transition"
              >
                Next
              </button>

              <button
                className="text-white mt-3 underline text-sm"
                onClick={() => setCodeSent(false)}
              >
                Change phone number
              </button>

             
            </div>
  )
}

export default VerifyOtp
