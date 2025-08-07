"use client";

import { motion } from "framer-motion";
import GameCards from "./gameCards";
import CasinoGamesUI from "./games";
import HeroSlider from "./ui/HeroSlider";

interface LandingPageProps {
  isLoggedIn: boolean;
}

export default function LandingPage({ isLoggedIn }: LandingPageProps) {
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

 
  const promotions = [
    {
      title: "Welcome Bonus",
      description: "100% match up to $1000",
      code: "WELCOME100",
      gradient: "from-red-500 to-purple-600",
    },
    {
      title: "Free Spins Friday",
      description: "50 free spins every Friday",
      code: "FRIDAY50",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "VIP Cashback",
      description: "10% cashback on all losses",
      code: "VIP10",
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSlider isLoggedIn={isLoggedIn}/>

      {/* Game Categories */}
          <GameCards/>
          <CasinoGamesUI/>

      {/* Promotions */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent"
          >
            Hot Promotions
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {promotions.map((promo, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${promo.gradient} rounded-xl p-6 text-white relative overflow-hidden cursor-pointer`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                <p className="text-lg mb-4 opacity-90">{promo.description}</p>
                <div className="bg-black/20 rounded-lg px-3 py-2 inline-block">
                  <span className="text-sm font-mono">Code: {promo.code}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-semibold transition-all"
                >
                  Claim Now
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {isLoggedIn && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { label: "Games Played", value: "1,247" },
                { label: "Total Winnings", value: "$12,450" },
                { label: "Current Level", value: "Gold" },
                { label: "Loyalty Points", value: "8,920" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-black/40 backdrop-blur-lg rounded-xl border border-gray-700 p-6 text-center"
                >
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
