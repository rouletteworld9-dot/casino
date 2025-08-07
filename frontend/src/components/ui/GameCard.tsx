import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      onClick={() => {
        if (game.title === "AUTO-ROULETTE") {
          navigate("/casino/game"); // Navigate to the casino game page
        }
      }}
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative rounded-lg overflow-hidden cursor-pointer group ${game.image} aspect-[4/4]`}
    >
      {game.isTop && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold z-10">
          TOP
        </div>
      )}
      {game.hasInfo && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white z-10"
        >
          <Info className="w-4 h-4" />
        </motion.button>
      )}
      <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
        {game.icon}
      </div>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-bold text-sm leading-tight mb-1">
          {game.title}
        </h3>
        <p className="text-gray-300 text-xs">{game.provider}</p>
      </div>
    </motion.div>
  );
};
export default GameCard;
