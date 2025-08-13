import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../../hooks/useTransactions";

const ShowQR = ({ setShowQR, amount }) => {
  const [utr, setUtr] = useState("");

  const { depositRequestFn, depositRequestLoading } = useTransactions();
  const handleSubmitPayment = async () => {
    if (!utr.trim()) {
      alert("Please enter your UTR number");
      return;
    }
    await depositRequestFn(
      { amount, utr },
      {
        onSuccess: () => {
          setShowQR(false);
        },
      }
    );
  };
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg text-center w-96"
      >
        <h2 className="text-lg font-bold mb-4 text-black">Scan to Pay</h2>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStrccmmalpPtI4sX78k6OXyFkA3-mw6mXJ_A&s"
          alt="UPI QR Code"
          className="w-48 h-48 mx-auto mb-4"
        />
        <input
          type="text"
          placeholder="Enter UTR Number"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmitPayment}
            disabled={depositRequestLoading}
            className={`flex-1 px-4 py-2 rounded-lg text-white ${
              depositRequestLoading
                ? "bg-gray-400"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {depositRequestLoading ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={() => setShowQR(false)}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShowQR;
