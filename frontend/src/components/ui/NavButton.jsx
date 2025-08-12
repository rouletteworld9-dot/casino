import { motion } from "framer-motion";

export default function NavButton({ children, onClick, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`text-white hover:text-purple-300 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
}
