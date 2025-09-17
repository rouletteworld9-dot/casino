import Footer from "./footer";
import GameCards from "./gameCards";
import CasinoGamesUI from "./games";
import Header from "./header";
import HeroSlider from "./ui/HeroSlider";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export default function LandingPage({ isLoggedIn }) {
  const user = useAuthStore((s) => s.user);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const confettiInjectedRef = useRef(false);
  const soundRef = useRef(null);
  const bonusKey = useMemo(() => (user?._id ? `welcomeBonusShown:${user._id}` : null), [user?._id]);

  // useEffect(() => {
  //   if (!user || !bonusKey) return;
  //   try {
  //     const alreadyShown = localStorage.getItem(bonusKey);
  //     if (!alreadyShown) {
  //       setShowWelcomeBonus(true);
  //     }
  //   } catch (e) {
  //     setShowWelcomeBonus(true);
  //   }
  // }, [user, bonusKey]);

  // const handleCloseWelcome = () => {
  //   if (bonusKey) {
  //     try { localStorage.setItem(bonusKey, "1"); } catch (e) {}
  //   }
  //   setShowWelcomeBonus(false);
  // };

  // useEffect(() => {
  //   if (!showWelcomeBonus) return;

  //   // Play celebration sound (uses public/sounds)
  //   try {
  //     if (!soundRef.current) {
  //       soundRef.current = new Audio("/sounds/result.mp3");
  //       soundRef.current.volume = 0.5;
  //     }
  //     soundRef.current.currentTime = 0;
  //     soundRef.current.play().catch(() => {});
  //   } catch (e) {}

  //   // Load confetti library once on-demand
  //   const ensureConfetti = () =>
  //     new Promise((resolve) => {
  //       if (window.confetti) return resolve();
  //       if (confettiInjectedRef.current) return resolve();
  //       const script = document.createElement("script");
  //       script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
  //       script.async = true;
  //       script.onload = () => resolve();
  //       document.head.appendChild(script);
  //       confettiInjectedRef.current = true;
  //     });

  //   const fire = () => {
  //     if (!window.confetti) return;
  //     const defaults = { spread: 360, ticks: 80, gravity: 0.9, decay: 0.94, startVelocity: 25 }; 
  //     window.confetti({ ...defaults, particleCount: 60, origin: { x: 0.2, y: 0.1 } });
  //     window.confetti({ ...defaults, particleCount: 60, origin: { x: 0.8, y: 0.1 } });
  //     window.confetti({ ...defaults, particleCount: 80, origin: { x: 0.5, y: 0.2 } });
  //   };

  //   let intervalId;
  //   ensureConfetti().then(() => {
  //     fire();
  //     intervalId = setInterval(fire, 600);
  //     setTimeout(() => { if (intervalId) clearInterval(intervalId); }, 2400);
  //   });

  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [showWelcomeBonus]);
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
   {/* {user && showWelcomeBonus && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={handleCloseWelcome}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="relative w-[90%] max-w-md rounded-2xl border border-pink-500/30 bg-gradient-to-b from-purple-900/90 to-black/80 p-6 text-white shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center mt-2">
        <p className="text-xl uppercase tracking-wide font-bold text-pink-600/80 text-shadow-red-100">
          Congratulations
        </p>
        <h3 className="mt-1 text-2xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
          ₹3000 Welcome Bonus
        </h3>
        <p className="mt-2 text-sm text-gray-200/90">
          You have received a <span className="text-yellow-300 font-semibold">₹3000</span> bonus on your first
          login. Enjoy playing!
        </p>

        <div className="mt-5">
          <button
            onClick={handleCloseWelcome}
            className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-pink-600/90 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-pink-500 transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-6 -left-6 h-20 w-20 rotate-12 rounded-lg bg-pink-500/10 blur-md" />
        <div className="absolute -bottom-6 -right-6 h-24 w-24 -rotate-12 rounded-full bg-yellow-400/10 blur-md" />
      </div>
    </motion.div>
  </div>
)} */}
      <Header />
      {/* Hero Section */}
      <HeroSlider className="rounded-none sm:h-[80vh] h-[30vh]" />

      {/* Game Categories */}
      <GameCards />
      <CasinoGamesUI />

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
                  className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-semibold transition-all cursor-pointer"
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
      <Footer />
    </div>
  );
}
