import { motion } from "framer-motion";
import GameCard from "./ui/GameCard";

const GameContainer = ({ className = "" }) => {
  const games = [
    {
      id: 1,
      title: "CRAZY TIME",
      provider: "EZUGI",
      image: "/game/CrazyTime.webp",
      icon: "🎯",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 2,
      title: "AUTO-ROULETTE",
      provider: "EVOLUTION",
      image: "/game/bg-autoroulette.webp",
      icon: "🎯",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 3,
      title: "BET ON TEEN PATTI",
      provider: "EZUGI",
      image: "/game/betOnTeenPatti.webp",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 4,
      title: "BACCARAT B",
      provider: "EZUGI",
      image: "/game/BaccaratB.webp",
      icon: "♠️",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 5,
      title: "ASTRONAUT",
      provider: "EZUGI",
      image: "/game/Astronaut.webp",
      icon: "🏏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 6,
      title: "LUCKY 7",
      provider: "EZUGI",
      image: "/game/lucky7.webp",
      icon: "🎰",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 7,
      title: "DRAGON TIGER",
      provider: "EZUGI",
      image: "/game/DragonTiger.webp",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 8,
      title: "IMMERSIVE ROULETTE",
      provider: "EVOLUTION",
      image: "/game/ImmersiveRoulette.webp",
      icon: "🎡",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 9,
      title: "SUPER ANDAR BAHAR",
      provider: "EZUGI",
      image: " /game/SuperAndarBahar.webp",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 10,
      title: "STOCK MARKET",
      provider: "EZUGI",
      image: "/game/StockMarket.webp",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 11,
      title: "LIGHTNING ROULETTE",
      provider: "EZUGI",
      image: "/game/LightningRoulette.webp",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 12,
      title: "HINDI ROULETTE",
      provider: "EZUGI",
      image: "/game/Hindi_Roulette.webp",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 13,
      title: "ANDAR BAHAR",
      provider: "EZUGI",
      image: "/game/AndarBahar.webp",
      icon: "🃏",
      isTop: true,
      hasInfo: true,
    },
    {
      id: 14,
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
