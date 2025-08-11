import React from 'react'
import { motion } from 'framer-motion'
const NavButton = ({ children, onClick, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`text-white hover:text-purple-300 transition-colors ${className}`}
  >
    {children}
  </motion.button>
);

export default NavButton
