import React from "react";
import { motion } from "framer-motion";

const LiveButton = ({ onClick, className = "" }) => {
  const dotVariants = {
    animate: {
      opacity: [1 , 0.2 , 1],
      scale: [1 , 1.2 , 1.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      //   boxShadow: [
      //     "0 0 0 0 rgba(239, 68, 68, 0.4)",
      //     "0 0 0 2px rgba(239, 68, 68, 0)",
      //     "0 0 0 0 rgba(239, 68, 68, 0)",
      //   ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeOut",
      },
    },
  };

  const buttonGlowVariants = {
    animate: {
      //   boxShadow: [
      //     "0 0 5px rgba(239, 68, 68, 0.3), 0 0 10px rgba(239, 68, 68, 0.2), 0 0 15px rgba(239, 68, 68, 0.1)",
      //     "0 0 10px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.2)",
      //     "0 0 5px rgba(239, 68, 68, 0.3), 0 0 10px rgba(239, 68, 68, 0.2), 0 0 15px rgba(239, 68, 68, 0.1)",
      //   ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const borderGlowVariants = {
    animate: {
      //   borderColor: [
      //     "rgba(239, 68, 68, 0.5)",
      //     "rgba(239, 68, 68, 0.8)",
      //     "rgba(239, 68, 68, 0.5)",
      //   ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative inline-flex items-center gap-2 px-4 py-1
        bg-gray-900 hover:bg-gray-800 
        text-white font-semibold 
        rounded-lg border-2
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
        className="absolute w-3 h-3 bg-red-600 rounded-full left-4"
        variants={pulseVariants}
        animate="animate"
      />

      {/* Main red dot */}
      <motion.div
        className="w-3 h-3 bg-red-600 rounded-full relative z-10"
        variants={dotVariants}
        animate="animate"
      />

      <span className="text-sm font-medium tracking-wide relative z-10">
        LIVE
      </span>
    </motion.button>
  );
};
export default LiveButton;
