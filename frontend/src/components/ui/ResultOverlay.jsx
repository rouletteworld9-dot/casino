import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../stores/useGameStore";

const ResultOverlay = ({ onClose }) => {
  const {
    winStatus: { isWin = true, amount },
  } = useGameStore();
  if (isWin === null) return;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, delay: 4 },
    },
  };

  const cardVariants = {
    hidden: {
      scale: 0.3,
      opacity: 0,
      y: 100,
      rotateX: 90,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        delay: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: isWin ? -180 : 180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 300,
        delay: 0.3,
      },
    },
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const particleVariants = {
    animate: {
      y: [-20, -100],
      opacity: [1, 0],
      scale: [1, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [0.8, 1.2, 0.8],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Confetti variants
  const confettiVariants = {
    animate: (i) => ({
      y: [0, window.innerHeight + 100],
      x: [0, (Math.random() - 0.5) * 400],
      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
      opacity: [1, 0.8, 0],
      transition: {
        duration: 3 + Math.random() * 2,
        delay: i * 0.1,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 2,
      },
    }),
  };

  // Generate random positions for sparkles
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 400 - 200,
    y: Math.random() * 400 - 200,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#ffa726",
      "#ab47bc",
      "#26c6da",
      "#ff7043",
      "#66bb6a",
      "#fdd835",
      "#ef5350",
    ][Math.floor(Math.random() * 10)],
    shape: Math.random() > 0.5 ? "rect" : "circle",
    size: 4 + Math.random() * 8,
    startX: Math.random() * window.innerWidth,
  }));

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 flex items-center justify-center z-50 backdrop-blur-md"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Confetti for win */}
      {isWin && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className={`absolute ${piece.shape === "rect" ? "rounded-sm" : "rounded-full"}`}
              style={{
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                left: piece.startX,
                top: -piece.size,
              }}
              custom={piece.id}
              variants={confettiVariants}
              animate="animate"
            />
          ))}
        </div>
      )}

      {/* Background sparkles for win */}
      {isWin && (
        <div className="absolute inset-0 overflow-hidden">
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `50%`,
                top: `50%`,
                marginLeft: sparkle.x,
                marginTop: sparkle.y,
              }}
              variants={sparkleVariants}
              animate="animate"
              transition={{
                delay: sparkle.delay,
                duration: sparkle.duration,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className={`relative bg-gradient-to-br rounded-3xl p-10 text-center shadow-[0_0_80px_rgba(0,0,0,0.8)] max-w-lg w-full mx-4 border-2 
          backdrop-blur-xl overflow-hidden`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Content container */}
        <div className="relative z-10">
          {isWin ? (
            <>
              {/* Floating particles for win */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                    style={{
                      left: `${20 + i * 10}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                    variants={particleVariants}
                    animate="animate"
                    transition={{
                      delay: i * 0.2,
                      duration: 3 + Math.random(),
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>

              {/* Win Icon */}
              <div className="relative mb-5 flex items-center justify-center ">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-white rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    className="w-10 h-10 text-yellow-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={4}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              </div>

              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-white space-y-4"
              >
                <motion.h2
                  className="text-6xl font-black mb-4 relative"
                  style={{
                    background:
                      "linear-gradient(45deg, #facc15, #fde047, #fbbf24)",
                    backgroundSize: "300% 300%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    // textShadow: "0 0 30px rgba(16, 185, 129, 0.5)",
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  VICTORY
                </motion.h2>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
                >
                  <p className="text-2xl font-semibold text-gray-100 mb-2">
                    Congratulations! You won ${amount}
                  </p>
                </motion.div>
              </motion.div>
            </>
          ) : (
            <>
              {/* Loss Icon */}

              <div className="relative flex items-center mb-5 justify-center ">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-red-200 to-white rounded-full flex items-center justify-center"
                  animate={{
                    rotate: [0, -15, 15, -15, 0],
                    scale: [1, 0.95, 1],
                  }}
                  transition={{
                    delay: 0.5,
                    duration: 1,
                    repeat: 2,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    className="w-10 h-10 text-red-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={4}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.div>
              </div>

              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-white space-y-4"
              >
                <motion.h2
                  className="text-6xl font-black mb-4"
                  style={{
                    background:
                      "linear-gradient(45deg, #ef4444, #f87171, #fca5a5, #f87171, #ef4444)",
                    backgroundSize: "300% 300%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 0 30px rgba(239, 68, 68, 0.5)",
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  YOU LOST
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <p className="text-2xl font-semibold text-gray-200 mb-2">
                    Better Luck Next time...
                  </p>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultOverlay;
