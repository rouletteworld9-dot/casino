import React from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
const UserHeaderDropdown = ({ setIsDropdown, onNavigate }) => {
  const { logoutUser } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      onMouseLeave={() => setIsDropdown(false)}
      className="absolute right-0 mt-2 w-32 bg-deepPurple border-deepBorder rounded shadow-lg z-100"
    >
      <button
        onClick={() => onNavigate("/user")}
        className="block w-full text-left px-2 py-2 text-xs hover:bg-midnightPurple text-white"
      >
        My Account
      </button>
      <button
        onClick={() => onNavigate("deposit")}
        className="block w-full text-left px-2 py-2 text-xs hover:bg-midnightPurple text-white"
      >
        Make a Deposit
      </button>
      <button
        onClick={() => {
          logoutUser();
        }}
        className="space-x-1 flex w-full text-left px-2 py-2 text-xs text-red-300 hover:bg-midnightPurple"
      >
        <LogOut size={16} />
        <p>Logout</p>
      </button>
    </motion.div>
  );
};

export default UserHeaderDropdown;
