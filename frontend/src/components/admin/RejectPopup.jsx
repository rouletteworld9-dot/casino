import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const RejectPopup = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Rejection reason is required!");
      return ;
    }
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-deepPurple text-white p-6 rounded-xl shadow-lg w-11/12 max-w-md"
      >
        <h2 className="text-lg font-bold mb-4">Reject Transaction</h2>
        <p className="mb-3 text-sm text-gray-300">
          Why do you want to reject the Transaction Request?
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full p-2 rounded bg-midnightPurple text-white border border-gray-500 focus:outline-none"
          placeholder="Enter rejection reason..."
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            Reject
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectPopup;
