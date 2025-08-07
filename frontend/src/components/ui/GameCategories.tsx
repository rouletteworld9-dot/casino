import {
  Cherry,
  Crown,
  Gamepad2,
  Gift,
  ShoppingCart,
  Trophy,
  Zap,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const GameCategories = () => {
  const categories = [
    { name: "All games", icon: <Zap className="w-6 h-6" />, active: true },
    { name: "Top", icon: <Crown className="w-6 h-6" />, active: false },
    { name: "Slots", icon: <Cherry className="w-6 h-6" />, active: false },
    {
      name: "Crash Games",
      icon: <Gamepad2 className="w-6 h-6" />,
      active: false,
    },
    { name: "New", icon: <Gift className="w-6 h-6" />, active: false },
    { name: "Spin Gifts", icon: <Gift className="w-6 h-6" />, active: false },
    {
      name: "Buy Bonus",
      icon: <ShoppingCart className="w-6 h-6" />,
      active: false,
    },
    { name: "V-Sports", icon: <Trophy className="w-6 h-6" />, active: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 flex-shrink-0"
    >
      <div className="space-y-2">
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              category.active
                ? "bg-yellow-500 text-black"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {category.icon}
            <span className="font-medium">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default GameCategories;
