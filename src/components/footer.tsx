"use client";
import { motion } from "framer-motion";
import { Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    "About us",
    "Rules",
    "Terms and Conditions",
    "Privacy Policy",
    "Responsible gaming",
    "Cookie Policy",
    "Affiliate Program",
    "License",
    "AML Policy",
  ];

  const gameProviders = [
    { name: "BGaming", logo: "🎮" },
    { name: "Endorphina", logo: "🎯" },
    { name: "Hacksaw Gaming", logo: "🔨" },
    { name: "Smartsoft Gaming", logo: "🎲" },
    { name: "Spinomenal", logo: "🎰" },
    { name: "Spribe", logo: "✈️" },
    { name: "Provider 1", logo: "🎪" },
    { name: "Provider 2", logo: "🎨" },
    { name: "Provider 3", logo: "⚡" },
    { name: "Provider 4", logo: "🎭" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid mb-2"
        >
          {footerLinks.map((link, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 2 }}
              className="text-gray-400 hover:text-white transition-colors text-left text-xs py-1"
            >
              {link}
            </motion.button>
          ))}
        </motion.div>

        {/* Support Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-end mb-2"
        >
          <span className="text-gray-400 text-xs">support@batery.in</span>
        </motion.div>

        <hr className="w-full h-1 mb-3 " />

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex space-x-4 mb-3"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-colors"
          >
            <Instagram className="w-5 h-5 text-gray-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </motion.button>
        </motion.div>

        <hr className="w-full h-1 mb-3 " />

        {/* Game Providers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="grid grid-cols-5 md:grid-cols-10 gap-6 items-center justify-items-center">
            {gameProviders.map((provider, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center space-y-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="w-12 h-8 bg-gray-800 border border-gray-700 rounded flex items-center justify-center text-lg">
                  {provider.logo}
                </div>
                <span className="text-xs text-gray-500 text-center">
                  {provider.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Age Restriction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-block bg-gray-800 border border-gray-600 rounded px-3 py-1">
            <span className="text-gray-300 font-semibold">18+</span>
          </div>
        </motion.div>

        {/* Legal Text and Certifications */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end space-y-6 lg:space-y-0">
          {/* Legal Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 max-w-4xl"
          >
            <p className="text-gray-500 text-xs leading-relaxed">
              This website is operated by YouGmedia B.V., company number 153269,
              with registered address at Dr. H. Fergusonweg 1, Curaçao, that is
              authorized by the Government of Curaçao to conduct gaming
              operations under auspices of National Ordinance on Offshore Games
              of Hazard (NOOGH)
            </p>
          </motion.div>

          {/* Certification Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4"
          >
            {/* GCB Certification */}
            <div className="bg-green-600 text-white px-3 py-2 rounded text-xs font-bold">
              GCB
              <div className="text-xs font-normal">cert gcb.cw</div>
            </div>

            {/* Chat Support */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-colors"
            >
              💬
            </motion.button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
