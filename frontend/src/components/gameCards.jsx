import React from "react";
import { motion } from "framer-motion";
import { Dice6, Trophy, Heart, Plane, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GameCards = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const gameCategories = [
    {
      title: "Casino",
      subtitle: "14215 games",
      image: "/desk_Casino.png",
      buttonText: "View games",
      bgGradient: "from-pink-500 via-purple-600 to-purple-800",
      icon: <Dice6 className="w-16 h-16 text-white" />,
      decorativeElement: (
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
      ),
    },
    {
      title: "Sport",
      subtitle: "4700 events",
      image: "/desk_Sport.png",
      buttonText: "View events",
      bgGradient: "from-orange-400 via-orange-500 to-orange-600",
      icon: (
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-orange-600 rounded-full relative">
            <div className="absolute inset-1 bg-orange-400 rounded-full"></div>
            <div className="absolute top-2 left-3 w-1 h-6 bg-orange-600 rounded-full transform rotate-45"></div>
            <div className="absolute top-3 left-2 w-6 h-1 bg-orange-600 rounded-full transform rotate-45"></div>
          </div>
        </div>
      ),
      decorativeElement: (
        <div className="absolute -bottom-2 -right-2">
          <div className="w-8 h-8 bg-yellow-400 transform rotate-45"></div>
          <div className="w-6 h-6 bg-yellow-500 transform rotate-45 absolute top-1 left-1"></div>
        </div>
      ),
    },
    {
      title: "Live casino",
      subtitle: "503 games",
      image: "/desk_Live_casino.png",
      buttonText: "View games",
      bgGradient: "from-purple-600 via-purple-700 to-purple-900",
      icon: (
        <div className="flex space-x-1">
          <div className="w-8 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-lg relative">
            <Heart
              className="w-4 h-4 text-white absolute top-1 left-2"
              fill="white"
            />
            <span className="text-white text-xs absolute bottom-1 left-2 font-bold">
              K
            </span>
          </div>
          <div className="w-8 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-lg relative">
            <Heart
              className="w-4 h-4 text-white absolute top-1 left-2"
              fill="white"
            />
            <span className="text-white text-xs absolute bottom-1 left-2 font-bold">
              Q
            </span>
          </div>
          <div className="w-8 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-lg relative">
            <Heart
              className="w-4 h-4 text-white absolute top-1 left-2"
              fill="white"
            />
            <span className="text-white text-xs absolute bottom-1 left-2 font-bold">
              J
            </span>
          </div>
        </div>
      ),
      decorativeElement: (
        <div className="absolute -bottom-2 -right-2">
          <div className="w-8 h-8 bg-yellow-400 transform rotate-45"></div>
          <div className="w-6 h-6 bg-yellow-500 transform rotate-45 absolute top-1 left-1"></div>
        </div>
      ),
    },
    {
      title: "Aviator",
      subtitle: "Instant game",
      image: "/desk_Aviator_supernew.png",
      buttonText: "Play now",
      bgGradient: "from-lime-400 via-yellow-400 to-yellow-500",
      icon: (
        <div className="relative">
          <Plane className="w-16 h-16 text-red-600 transform rotate-12" />
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full"></div>
        </div>
      ),
      decorativeElement: (
        <div className="absolute -bottom-2 -right-2">
          <div className="w-8 h-8 bg-yellow-400 transform rotate-45"></div>
          <div className="w-6 h-6 bg-yellow-500 transform rotate-45 absolute top-1 left-1"></div>
        </div>
      ),
    },
  ];

  return (
    <div className="py-10 bg-gradient-to-br from-deepPurple via-deepPurple to-deepPurple px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {gameCategories.map((category, index) => (
          <motion.div
            onClick={() => {
              if (category.title === "Casino") {
                navigate("/casino/game");
              }
            }}
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${category.bgGradient} p-3 shadow-2xl cursor-pointer group min-h-[150px]`}
          >
            {/* Decorative Image */}
            <img
              src={category.image}
              alt=""
              className="absolute top-[-50px] right-0 left-0 mx-auto w-full z-10 "
            />

            {/* Chevron arrows in top right */}
            {/* <div className="absolute top-4 right-4 opacity-60">
              <ChevronRight className="w-6 h-6 text-white" />
              <ChevronRight className="w-6 h-6 text-white absolute top-0 left-2" />
            </div> */}

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {category.title}
                </h3>
                <p className="text-white/80 text-sm">{category.subtitle}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/30 transition-colors flex items-center justify-center space-x-2 w-fit"
              >
                <span className="cursor-pointer">{category.buttonText}</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GameCards;
