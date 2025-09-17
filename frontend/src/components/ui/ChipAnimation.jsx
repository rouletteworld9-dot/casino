import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/useGameStore";
import { useState, useEffect } from "react";

export default function ChipAnimation() {
  const { isWin, amount } = useGameStore(s => s.winStatus);
  const [showChips, setShowChips] = useState(false);

  useEffect(() => {
    if (isWin) {
      setShowChips(true);
      // Auto-hide chips after animation completes
      const timer = setTimeout(() => {
        setShowChips(false);
      }, 1200); // 800ms animation + 400ms buffer
      
      return () => clearTimeout(timer);
    }
  }, [isWin]);

  const generateChips = () => {
    const chips = [];
    const chipCount = Math.min(Math.floor(amount / 100) + 3, 8); // 3-8 chips based on amount
    
    for (let i = 0; i < chipCount; i++) {
      chips.push({
        id: i,
        delay: i * 0.1,
        startX: window.innerWidth/2,
        startY: Math.random() * (window.innerHeight / 2),
      });
    }
    return chips;
  };

  if (!showChips) return null;

  return (
    <AnimatePresence>
      {showChips && generateChips().map((chip) => (
        <motion.div
          key={chip.id}
          initial={{ 
            x: chip.startX, 
            y: chip.startY, 
            scale: 0.5, 
            opacity: 0,
            rotate: 0
          }}
          animate={{ 
            x: [chip.startX-100, chip.startX - 200, chip.startX - 300], // Curved path to bottom left
            y: [chip.startY, chip.startY + 50, chip.startY + 200, window.innerHeight - 100], // Curved path down
            scale: 1, 
            opacity: 1,
            rotate: 360
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.3 
          }}
          transition={{ 
            duration: 1, 
            ease: "easeInOut",
            delay: chip.delay
          }}
          className="fixed w-12 h-12 rounded-full flex items-center justify-center font-bold text-black shadow-lg z-[9999] pointer-events-none"
          style={{
            background: "linear-gradient(145deg, #FFD700, #FFA500)",
            border: "2px solid #B8860B",
          }}
        >
          <span className="text-xs">₹{Math.floor(amount / generateChips().length)}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}