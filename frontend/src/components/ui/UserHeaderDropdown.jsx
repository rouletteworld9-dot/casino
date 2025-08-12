import React from "react";
import { motion } from "framer-motion";
const UserHeaderDropdown = ({ setIsDropdown }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      onMouseLeave={() => setIsDropdown(false)}
      className="absolute right-0 mt-2 w-44 bg-[#1E0E24]  rounded shadow-lg z-50"
    >
      <button
        onClick={() => onNavigate("/my-account")}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        My Account
      </button>
      <button
        onClick={() => onNavigate("deposit")}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        Make a Deposit
      </button>
      <button
        onClick={() => {
          // onLogout()
        }}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </motion.div>
  );
};

export default UserHeaderDropdown;
