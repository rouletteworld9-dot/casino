// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const BetPlacedAnimation = ({ trigger, phase }) => {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (phase === "result") {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   }, [trigger, phase]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <div className="absolute inset-0 flex items-center justify-center z-50">
//           {/* Glow Ring */}
//           <motion.img
//             src="/game/shimmer-ring1.png"
//             alt="Highlight Ring"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1.2 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.5, ease: "easeInOut" }}
//             className="absolute w-20 h-10 pointer-events-none"
//           />

//           {/* Peg marker */}
//           <motion.img
//             src="/game/betplaced.png"
//             alt="Bet Placed"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0, opacity: 0 }}
//             transition={{ duration: 0.4, ease: "backOut" }}
//             className="absolute -left-2  w-30 h-20"
//           />
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default BetPlacedAnimation;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BetPlacedAnimation = ({ trigger, phase }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (phase === "result") {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [trigger, phase]);

  // Ring animation variants
  const ringVariants = {
    initial: {
      scale: 0.3,
      opacity: 0,
      rotate: -180,
    },
    animate: {
      scale: [0.3, 1.2, 1],
      opacity: [0, 1, 0.8],
      rotate: [180, 0, 0],
      transition: {
        duration: 0.8,
        ease: "easeOut",
        times: [0, 0.6, 1],
      },
    },
    exit: {
      scale: 0.3,
      opacity: 0,
      rotate: 180,
      transition: { duration: 0.3 },
    },
  };

  // Pulse ring variants
  const pulseRingVariants = {
    animate: {
      scale: [1, 1.5, 2],
      opacity: [0.6, 0.3, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut",
      },
    },
  };

  // Checkmark variants
  const checkmarkVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotate: -45,
    },
    animate: {
      scale: [0, 1.3, 1],
      opacity: [0, 1, 1],
      rotate: [-45, 10, 0],
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "backOut",
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: 45,
      transition: { duration: 0.2 },
    },
  };

  // Sparkle variants
  const sparkleVariants = {
    animate: (i) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      x: [0, ((i % 4) - 1.5) * 40],
      y: [0, Math.floor(i / 4) * 40 - 20],
      rotate: [0, 180 + i * 45],
      transition: {
        duration: 1.2,
        delay: 0.5 + i * 0.1,
        ease: "easeOut",
        repeat: 1,
      },
    }),
  };

  // Text variants
  const textVariants = {
    initial: {
      y: 20,
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      y: [20, -5, 0],
      opacity: [0, 1, 1],
      scale: [0.8, 1.1, 1],
      transition: {
        duration: 0.5,
        delay: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          {/* Outer pulse ring */}
          {/* <motion.div
            className="absolute w-24 h-24 border-4 border- een-400/60 rounded-full"
            variants={pulseRingVariants}
            animate="animate"
          /> */}

          {/* Main glow ring */}
          {/* <motion.div
            className="absolute w-20 h-20 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full border-2 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)]"
            variants={ringVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          /> */}

          {/* Inner highlight ring */}
          <motion.div
            className="absolute w-10 h-10 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full border border-yellow-300"
            variants={ringVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ delay: 0.1 }}
          />

          {/* Checkmark */}
          <motion.div
            className="absolute w-8 h-8 flex items-center justify-center"
            variants={checkmarkVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <svg
              className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          {/* Sparkles */}
          <div className="absolute">
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -4,
                  marginTop: -4,
                }}
                custom={i}
                variants={sparkleVariants}
                animate="animate"
              />
            ))}
          </div>

          {/* Success text */}
          {/* <motion.div
            className="absolute top-28 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <span className="text-sm font-bold tracking-wide">WINNER!</span>
          </motion.div> */}

          {/* Corner sparkles */}
          {[
            { top: "20%", left: "20%" },
            { top: "20%", right: "20%" },
            { bottom: "20%", left: "20%" },
            { bottom: "20%", right: "20%" },
          ].map((position, i) => (
            <motion.div
              key={`corner-${i}`}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={position}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 0.8,
                delay: 0.6 + i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default BetPlacedAnimation;
