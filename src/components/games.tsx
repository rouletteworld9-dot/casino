import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  Crown,
  Cherry,
  Gamepad2,
  Gift,
  ShoppingCart,
  Trophy,
  Info,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CasinoGamesUI = () => {
  const [activeTab, setActiveTab] = useState("Slots");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate =useNavigate()

  const tabs = [
    { name: "Slots", active: true },
    { name: "Live casino", active: false },
    { name: "Indian Choice", active: false },
    { name: "Instant", active: false },
    { name: "Table games", active: false },
  ];

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

  const games = [
    {
      id: 1,
      title: "CRICKET AUTO ROULETTE",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-green-700 to-green-800",
      icon: "🎯",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 2,
      title: "BET ON TEEN PATTI",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-600 to-brown-700",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 3,
      title: "BACCARAT B",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-red-600 to-red-700",
      icon: "♠️",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 4,
      title: "CRICKET WAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-green-500 to-green-600",
      icon: "🏏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 5,
      title: "LUCKY 7",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-yellow-600 to-yellow-700",
      icon: "🎰",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 6,
      title: "TEEN PATTI 3 CARD",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-orange-600 to-orange-700",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 7,
      title: "IMMERSIVE ROULETTE",
      provider: "EVOLUTION",
      image: "bg-gradient-to-br from-pink-600 to-pink-700",
      icon: "🎡",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 8,
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-700 to-brown-800",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 9,
      title: "AUTO-ROULETTE",
      provider: "EVOLUTION",
      image: "bg-gradient-to-br from-red-500 to-red-600",
      icon: "🎯",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 10,
      title: "See All",
      provider: "",
      image: "bg-gradient-to-br from-gray-700 to-gray-800",
      icon: "🔍",
      isTop: false,
      hasInfo: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const GameCard = ({ game }) => (
    <motion.div
    onClick={()=>{
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17071D] via-[#17071D] to-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
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
              className={`text-2xl font-bold transition-colors ${
                activeTab === tab.name
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.name}
            </motion.button>
          ))}
        </motion.div>
        <div className="flex gap-8">
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
          <div className="flex-1">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-6"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 w-80"
                />
              </div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoGamesUI;
