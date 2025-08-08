import { motion } from "framer-motion";
import GameCard from "./ui/GameCard";

const GameContainer = ({ className = "" }) => {
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
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-700 to-brown-800",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 10,
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-700 to-brown-800",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 11,
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-700 to-brown-800",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 12,
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-700 to-brown-800",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 13,
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-700 to-brown-800",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 14,
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "bg-gradient-to-br from-brown-700 to-brown-800",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 15,
      title: "AUTO-ROULETTE",
      provider: "EVOLUTION",
      image: "bg-gradient-to-br from-red-500 to-red-600",
      icon: "🎯",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 16,
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-2 gap-4 ${className}`}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </motion.div>
  );
};

export default GameContainer;
