import React from 'react'
import { motion } from 'framer-motion';

const motionFade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};
const InputField = ({
  label,
  type,
  name , 
  value,
  onChange,
  placeholder,
}) => (
  <motion.div {...motionFade}>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <input
    name={name}
      type={type || "text"}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
    />
  </motion.div>
);

export default InputField
