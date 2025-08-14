import React, { useState } from "react";
import { motion } from "framer-motion";

const GameTabs = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState("Slots");
  const tabs = [
    { name: "Slots", active: true },
    { name: "Live casino", active: false },
    { name: "Indian Choice", active: false },
    { name: "Instant", active: false },
    { name: "Table games", active: false },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex space-x-8  ${className}`}
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          whileHover={{ scale: 1.05 }}
          className={` font-bold transition-colors cursor-pointer ${
            activeTab === tab.name
              ? "text-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {tab.name}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default GameTabs;
