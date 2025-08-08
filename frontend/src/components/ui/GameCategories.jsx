import {
  Cherry,
  Crown,
  Gamepad2,
  Gift,
  ShoppingCart,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const defaultCategories = [
  { name: "All games", icon: <Zap size={18} />, active: true },
  { name: "Top", icon: <Crown size={18} />, active: false },
  { name: "Slots", icon: <Cherry size={18} />, active: false },
  {
    name: "Crash Games",
    icon: <Gamepad2 size={18} />,
    active: false,
  },
  { name: "New", icon: <Gift size={18} />, active: false },
  { name: "Spin Gifts", icon: <Gift size={18} />, active: false },
  {
    name: "Buy Bonus",
    icon: <ShoppingCart size={18} />,
    active: false,
  },
  { name: "V-Sports", icon: <Trophy size={18} />, active: false },
  { name: "V-Sports", icon: <Trophy size={18} />, active: false },
  { name: "V-Sports", icon: <Trophy size={18} />, active: false },
];

const GameCategories = ({
  className = "",
  categories = defaultCategories,
  buttonClassName = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex  gap-2 pb-4 ${className}`}
    >
      {categories.map((category, index) => {
        const isActive = category.active;
        const baseClasses =
          "flex flex-col items-center justify-center space-y-1";
        const activeClasses = isActive
          ? "text-yellow-500"
          : "text-gray-400 hover:text-white";

        return (
          <motion.button
            key={`${category.name}-${index}`}
            whileHover={{ scale: 1.05 }}
            className={`${baseClasses} ${activeClasses} ${buttonClassName}`}
          >
            {category.icon}
            <span className="text-xs font-medium text-center">
              {category.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default GameCategories;
