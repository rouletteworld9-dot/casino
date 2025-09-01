import React from "react";
import { motion } from "framer-motion";

const LiveButton = ({ onClick, className = "" }) => {
  const dotVariants = {
    animate: {
      opacity: [1, 0.2, 1],
      scale: [1, 1.2, 1.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative inline-flex items-center gap-2 sm:px-4 px-1 py-1
        sm:bg-gray-900 sm:hover:bg-gray-800 
        text-white font-semibold 
        sm:rounded-lg sm:border-2
        transition-colors duration-200
        ${className}
      `}
      //   variants={buttonGlowVariants}
      //   animate="animate"

      whileTap={{ scale: 0.98 }}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-lg  "
        // variants={borderGlowVariants}
        // animate="animate"
        style={{ zIndex: 1 }}
      />

      {/* Pulsing background effect */}
      <motion.div
        className="absolute hidden sm:block sm:w-3 sm:h-3 w-2 h-2 bg-green-600 rounded-full left-4"
        variants={pulseVariants}
        animate="animate"
      />

      {/* Main red dot */}
      <motion.div
        className="sm:w-3 sm:h-3 w-1 h-1 bg-green-600 rounded-full relative z-10"
        variants={dotVariants}
        animate="animate"
      />

      <span className="sm:text-sm text-xs font-medium tracking-wide relative z-10">
        LIVE
      </span>
    </motion.button>
  );
};
export default LiveButton;
