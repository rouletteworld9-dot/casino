import { motion } from "framer-motion";

export default function ChipAnimation({ start, end, amount, onComplete }) {
  console.log(start , "strat")
  if (!start || !end) return null;

  const x = end.left - start.left;
  const y = end.top - start.top;

  return (
    <motion.div
      key={`${start.left}-${start.top}-${end.left}-${end.top}-${amount}`}
      initial={{ x: 0, y: 0, scale: 0.8, opacity: 0 }}
      animate={{ x, y, scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className="sm:hidden fixed w-10 h-10 rounded-full flex items-center justify-center font-bold text-black shadow-lg z-[9999]"
      style={{
        top: start.top,
        left: start.left,
        background: "#FFD700",
      }}
    >
      ₹{amount}
    </motion.div>
  );
}
