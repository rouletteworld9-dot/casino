import { motion, AnimatePresence } from "framer-motion";

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-midnightPurple text-white p-6 rounded-xl shadow-2xl w-full max-w-sm"
          >
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
            <p className="text-sm text-gray-300 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
