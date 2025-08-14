import React, { useState } from "react";
import { User, CreditCard, BarChart3, Notebook, Menu, X } from "lucide-react";
import BalanceCards from "../ui/BalanceCards";
import { useAuth } from "../../hooks/useAuth";
import SidebarLink from "../ui/SideBarLink";
import { motion, AnimatePresence } from "framer-motion";

const NAVBAR_HEIGHT = 64; // 64px ~ h-16 (adjust if header changes)

const UserSidebar = () => {
  const { logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        // style={{ top: NAVBAR_HEIGHT / 2 - 20 }} // vertically centered in navbar
        className="fixed left-4 z-50 p-2 bg-midnightPurple rounded-lg text-white hover:bg-[#3a2044] transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3 }}
            // style={{ top: NAVBAR_HEIGHT }}
            className="fixed left-0 w-60 bg-[#1E0E24] text-white min-h-screen py-6 px-4 z-40 "
          >
            <BalanceCards />
            <div className="space-y-2 mt-4">
              <SidebarLink to="/user" exact icon={User} label="My profile" />
              <SidebarLink
                to="/user/deposits-withdrawals"
                icon={CreditCard}
                label="Deposits and withdrawals"
              />
              <SidebarLink
                to="/user/history"
                icon={BarChart3}
                label="Bet and transaction history"
              />
              <SidebarLink
                to="/user/requests"
                icon={Notebook}
                label="Requests"
              />

              <div className="w-full flex items-center mt-4">
                <button
                  onClick={logoutUser}
                  className="border border-yellow-600 rounded px-4 py-1 flex items-center space-x-3 transition-colors cursor-pointer"
                >
                  <span className="text-yellow-600 text-sm">Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSidebar;
