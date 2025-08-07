import React, { useState } from "react";
import { motion } from "framer-motion";

const GameTabs = () => {
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
      className="flex space-x-8 mb-8"
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          whileHover={{ scale: 1.05 }}
          className={`text-3xl font-bold transition-colors ${
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
