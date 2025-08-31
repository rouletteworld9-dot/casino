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
    { name: "BGaming", logo: "/api/placeholder/80/40" },
    { name: "Endorphina", logo: "/api/placeholder/80/40" },
    { name: "Hacksaw Gaming", logo: "/api/placeholder/80/40" },
    { name: "Smartsoft Gaming", logo: "/api/placeholder/80/40" },
    { name: "Spinomenal", logo: "/api/placeholder/80/40" },
    { name: "Spribe", logo: "/api/placeholder/80/40" },
    { name: "Provider 7", logo: "/api/placeholder/80/40" },
    { name: "Provider 8", logo: "/api/placeholder/80/40" },
    { name: "Provider 9", logo: "/api/placeholder/80/40" },
    { name: "Provider 10", logo: "/api/placeholder/80/40" },
  ];

  return (
    <footer
      className="text-white relative"
      style={{ backgroundColor: "#17071d" }} // deepPurple
    >
      <div className="container mx-auto px-6 py-12">
        {/* Top Section - Links and Support */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          {/* Footer Links - Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-3 mb-6 lg:mb-0"
          >
            {footerLinks.map((link, index) => (
              <motion.button
                key={index}
                whileHover={{
                  scale: 1.02,
                  x: 4,
                  color: "#ffd700",
                }}
                className="text-gray-400 hover:text-white transition-all duration-300 text-left text-sm  w-fit"
              >
                {link}
              </motion.button>
            ))}
          </motion.div>

          {/* Support Email - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-right flex flex-col"
          >
            <span className="text-gray-400 text-sm">support@casino.in</span>
            <span className="text-gray-400 text-sm">Customer Support : 7000843747</span>
          </motion.div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-2"
          style={{ backgroundColor: "#2a1033" }} // deepBorder
        />

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex space-x-4 mb-2"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 hover:border-yellow-400"
            style={{
              backgroundColor: "#231528", // lightPurple
              borderColor: "#2a1033", // deepBorder
            }}
          >
            <Instagram className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 hover:border-yellow-400"
            style={{
              backgroundColor: "#231528", // lightPurple
              borderColor: "#2a1033", // deepBorder
            }}
          >
            <MessageCircle className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </motion.button>
        </motion.div>

        {/* Another Divider */}
        <div
          className="w-full h-px mb-4"
          style={{ backgroundColor: "#2a1033" }} // deepBorder
        />

        {/* Game Providers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 items-center">
            {gameProviders.map((provider, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                className="flex flex-col items-center opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <div
                  className="w-20 h-10  rounded flex items-center justify-center "
                  style={{
                    backgroundColor: "#231528", // lightPurple
                  }}
                >
                  {/* Placeholder for provider logos */}
                  <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-300 font-mono">
                      {provider.name.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                </div>
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
          <div
            className="inline-block border rounded-lg px-2 py-1"
            style={{
              backgroundColor: "#231528", // lightPurple
              borderColor: "#2a1033", // deepBorder
            }}
          >
            <span
              className=" text-lg"
              style={{ color: "white" }} // casinoGold
            >
              18+
            </span>
          </div>
        </motion.div>

        {/* Bottom Section - Legal Text and Certifications */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end space-y-6 lg:space-y-0">
          {/* Legal Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 max-w-4xl pr-0 lg:pr-8"
          >
            <p className="text-gray-400 text-xs leading-relaxed">
              This website is operated by YouGmedia B.V., company number 153269,
              with registered address at Dr. H. Fergusonweg 1, Curaçao, that is
              authorized by the Government of Curaçao to conduct gaming
              operations under auspices of National Ordinance on Offshore Games
              of Hazard (NOOGH)
            </p>
          </motion.div>

          {/* Certification Badges and Chat */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4"
          >
            {/* GCB Certification */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white px-4 py-3 rounded-lg text-center min-w-[80px]"
              style={{ backgroundColor: "#28a745" }} // Green certification
            >
              <div className="font-bold text-sm">GCB</div>
              <div className="text-xs opacity-90">cert gcb.cw</div>
            </motion.div>

            {/* Chat Support Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
              style={{ backgroundColor: "#007bff" }} // Blue chat button
            >
              <div className="text-xl">💬</div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
