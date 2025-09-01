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

  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          {/* Glow Ring */}
          <motion.img
            src="/game/shimmer-ring1.png"
            alt="Highlight Ring"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute w-20 h-10 pointer-events-none"
          />

          {/* Peg marker */}
          <motion.img
            src="/game/betplaced.png"
            alt="Bet Placed"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="absolute -left-2  w-20 h-15"
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default BetPlacedAnimation;

