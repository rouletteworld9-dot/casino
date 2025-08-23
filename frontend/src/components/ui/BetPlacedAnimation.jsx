import React from 'react'
import {motion} from "framer-motion"

const BetPlacedAnimation = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      {/* Glow Ring (behind) */}
      <motion.img
        src="/game/shimmer-ring1.png"
        alt="Highlight Ring"
        animate={{
          opacity: [1, 1, 0.8],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: 2,
          ease: "easeInOut",
        }}
        className="absolute w-100 h-10 pointer-events-none"
      />

      {/* Peg marker (front) */}
      <motion.img
        src="/game/betplaced.png"
        alt="Bet Placed"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="absolute -left-2 w-14 h-14"
      />
    </div>
  );
}

export default BetPlacedAnimation
