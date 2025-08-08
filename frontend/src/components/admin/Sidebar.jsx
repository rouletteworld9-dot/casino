import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaMoneyCheckAlt,
  FaCog,
  FaExternalLinkAlt,
  FaTachometerAlt,
  FaGamepad,
  FaExchangeAlt,
  FaBars,
} from "react-icons/fa";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Members", path: "/admin/members", icon: <FaUsers /> },
    { name: "Games", path: "/admin/games", icon: <FaGamepad /> },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: <FaExchangeAlt />,
    },
    {
      name: "Browse Recharge",
      path: "/admin/browse-recharge",
      icon: <FaMoneyCheckAlt />,
    },
    {
      name: "Withdrawal(Approved)",
      path: "/admin/withdrawals",
      icon: <FaMoneyCheckAlt />,
    },
    {
      name: "Recharge (Approved)",
      path: "/admin/recharge-approve",
      icon: <FaMoneyCheckAlt />,
    },
    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
    // { name: 'Live Ongoing Game', path: '/admin/live-game', icon: <FaMoneyCheckAlt /> },
    {
      name: "Go to Website",
      path: "/",
      icon: <FaExternalLinkAlt />,
      external: true,
    },
  ];

  const sidebarVariants = {
    open: { width: "250px", transition: { duration: 0.3 } },
    closed: { width: "80px", transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="open"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="bg-[#2C023B] backdrop-blur border-r border-slate-800 h-screen p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        {isOpen && (
          <span className="text-md font-semibold text-white">Admin Panel</span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-purple-300 cursor-pointer ml-3"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.name}
            to={item.path}
            icon={item.icon}
            label={item.name}
            collapsed={!isOpen}
            external={item.external}
          />
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
