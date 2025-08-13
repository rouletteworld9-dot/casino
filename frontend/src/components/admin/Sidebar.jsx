import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {Users,CircleGauge,BadgeDollarSign, Banknote,BanknoteArrowUp,CirclePoundSterling,Settings,ExternalLink,Menu} from 'lucide-react';
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
    setIsOpen(isLargeScreen);
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <CircleGauge size={16} strokeWidth={2} absoluteStrokeWidth /> },
    { name: "Members", path: "/admin/members", icon: <Users size={16} strokeWidth={2} absoluteStrokeWidth />},
    // { name: "Games", path: "/admin/games", icon: <FaGamepad /> },
    {
      name: "Deposit Requests",
      path: "/admin/deposits",
      icon:  <Banknote size={16} strokeWidth={2} absoluteStrokeWidth />,
    },
    {
      name: "withdrawal Requests",
      path: "/admin/withdrawals",
      icon: <BanknoteArrowUp size={16} strokeWidth={2} absoluteStrokeWidth/>,

    },
    {
      name: "Withdrawal (Approved)",
      path: "/admin/withdrawals-settings",
      icon:<BanknoteArrowUp size={16} strokeWidth={2} absoluteStrokeWidth />,
    },
    {
      name: "Deposits (Approved)",
      path: "/admin/deposits-approve",
      icon:  <CirclePoundSterling size={16} strokeWidth={2} absoluteStrokeWidth />,

    },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={16} strokeWidth={2} absoluteStrokeWidth /> },
    // { name: 'Live Ongoing Game', path: '/admin/live-game', icon: <FaMoneyCheckAlt /> },
    {
      name: "Go to Website",
      path: "/",
      icon: <ExternalLink size={16} strokeWidth={2} absoluteStrokeWidth />,
      // external: true,
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
      className="bg-deepPurple backdrop-blur border-r border-midnightPurple h-screen p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        {isOpen && (
          <span className="text-lg font-semibold text-white">Admin Panel</span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-purple-300 cursor-pointer ml-3"
          aria-label="Toggle sidebar"
        >
          <Menu size={16} strokeWidth={2} absoluteStrokeWidth />
        </button>
      </div>

      <nav className="flex-1 space-y-1 mt-5">
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
