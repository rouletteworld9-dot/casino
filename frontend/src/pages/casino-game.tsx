import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Play, Gift, Users, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import GameTabs from '../components/ui/GameTabs';
import GameCategories from '../components/ui/GameCategories';

const CasinoDashboard = () => {
  const [activeTab, setActiveTab] = useState('Slots');
  
  const tabs = ['Slots', 'Live casino', 'Indian Choice', 'Instant', 'Table games'];
  
  const sidebarItems = [
    { icon: '🎰', label: 'All games', active: false },
    { icon: '⭐', label: 'Favourites', active: false },
    { icon: '🔥', label: 'Top', active: false },
    { icon: '🎯', label: 'Slots', active: true },
    { icon: '💥', label: 'Crash Games', active: false },
    { icon: '👍', label: 'Recommend...', active: false }
  ];

  const gameCards = [
    { id: 1, title: 'Aviator', image: '🛩️', tag: 'TOP', info: true },
    { id: 2, title: 'Sweet Bonanza', image: '🍭', tag: 'TOP', info: true },
    { id: 3, title: 'Santa vs Rudolf', image: '🎅', tag: 'TOP', info: true },
    { id: 4, title: 'Rocket Stars', image: '🚀', tag: 'TOP', info: true },
    { id: 5, title: 'Lucky 7', image: '🎰', tag: 'TOP', info: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17071D] via-[#17071D] to-[#17071D] text-white">
      {/* Header Tabs */}
      <div className="flex space-x-8 px-8 pt-6 pb-4">
        {/* {tabs.map((tab, index) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-2xl font-semibold transition-colors ${
              activeTab === tab
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab}
          </motion.button>
        ))} */}
        <GameTabs/>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {/* <motion.div
          className="w-40 px-4 space-y-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.label}
              className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${
                item.active
                  ? "bg-purple-600/30 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs text-center">{item.label}</span>
            </motion.div>
          ))}
        </motion.div> */}
        <GameCategories/>

        {/* Main Content */}
        <div className="flex-1 px-8">
          {/* Hero Section - Coin Strike 2 */}
          <motion.div
            className="relative rounded-2xl overflow-hidden mb-8 h-80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Lightning effects */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(255,255,0,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 30%, rgba(255,255,0,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 70%, rgba(255,255,0,0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <div className="relative z-10 p-8 h-full flex items-center justify-between">
              <div>
                <motion.h1
                  className="text-5xl font-bold mb-2"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Coin Strike 2
                </motion.h1>
                <motion.p
                  className="text-xl text-blue-100 mb-6"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Charge Up! New Top Coin Strike 2 Slot!
                </motion.p>
                <motion.button
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Play size={20} />
                  Play
                </motion.button>
              </div>

              {/* Coin Strike 2 Logo */}
              <motion.div
                className="text-right"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative">
                  <motion.div
                    className="text-8xl"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(255,215,0,0.8)",
                        "0 0 40px rgba(255,215,0,0.6)",
                        "0 0 20px rgba(255,215,0,0.8)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚡
                  </motion.div>
                  <div className="text-4xl font-bold text-center mt-2">
                    <span className="text-yellow-400">COIN</span>
                    <span className="text-blue-300">STRIKE</span>
                    <span className="text-red-400">2</span>
                  </div>
                  <div className="text-sm text-center mt-1 bg-red-600 rounded px-2 py-1 inline-block">
                    HOLD AND WIN 3x4
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation arrows */}
            <div className="absolute bottom-4 left-8 flex items-center gap-4">
              <span className="text-sm">2 / 6</span>
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="flex gap-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors">
              All providers
              <ChevronRight size={16} className="rotate-90" />
            </button>
            <button className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-700 transition-colors">
              <Filter size={16} />
              Filters
              <ChevronRight size={16} className="rotate-90" />
            </button>
            <button className="p-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              🍀
            </button>
          </motion.div>

          {/* TOP Section */}
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">🏆</span>
                </div>
                <h2 className="text-2xl font-bold">TOP</h2>
              </div>
              <motion.button
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                I'm lucky
              </motion.button>
            </div>

            {/* Game Cards */}
            <div className="grid grid-cols-5 gap-4">
              {gameCards.map((game, index) => (
                <motion.div
                  key={game.id}
                  className="relative group cursor-pointer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 h-40 relative overflow-hidden">
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
                        {game.tag}
                      </span>
                    </div>
                    {game.info && (
                      <button className="absolute top-2 right-2 w-6 h-6 bg-black/30 rounded-full flex items-center justify-center text-xs">
                        ℹ️
                      </button>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{game.image}</span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="text-white" size={32} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <motion.div
          className="w-80 pr-8 space-y-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Bonuses */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bonuses</h3>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-6xl opacity-20">
                🎰
              </div>
              <div className="relative z-10">
                <div className="text-sm text-purple-200 mb-1">
                  BONUS ACCOUNT: ₹1,500
                </div>
                <div className="font-bold text-lg mb-2">
                  Claim your bonus:{" "}
                  <span className="text-yellow-300">₹1,500</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-200 mb-3">
                  <span>🎲</span>
                  <span>💎</span>
                  <span>💍</span>
                  <span>16 days remaining</span>
                </div>
                <div className="text-sm">
                  <div className="mb-1">Wager: 0%</div>
                  <div className="w-full bg-purple-800/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Promos</h3>
              <MoreHorizontal className="text-gray-400" size={20} />
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-30">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
              </div>
              <div className="relative z-10">
                <div className="text-sm text-green-200 mb-1">
                  BRING A FRIEND
                </div>
                <div className="font-bold text-lg mb-2">
                  Get ₹300 + 50 FS
                  <br />
                  for each verified friend
                </div>
                <motion.button
                  className="bg-black/20 hover:bg-black/30 px-4 py-2 rounded-lg text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  More
                </motion.button>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-20">
                <div className="w-full h-full bg-gradient-to-t from-white/20 to-transparent rounded-tl-3xl"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CasinoDashboard;