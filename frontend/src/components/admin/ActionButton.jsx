import React from "react";
import { motion } from "framer-motion";

export default function ActionButton({
  label,
  onClick,
  loading = false,
  disabled = false,
  color = "blue",
  icon = null, // optional icon
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-3 py-1 bg-${color}-600 hover:bg-${color}-700 
        disabled:bg-gray-500 disabled:cursor-not-allowed 
        text-white rounded text-xs font-medium transition-colors duration-200`}
    >
      {loading ? (
        "Loading.."
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {label}
        </>
      )}
    </motion.button>
  );
}
