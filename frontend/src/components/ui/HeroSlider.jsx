"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// Default slides fallback (optional)
const defaultSlides = [
  {
    title: "Baccarat A",
    description: "Play with style – classic Baccarat thrills!",
    image: "/slider1.jpg",
    showPlay: true,
  },
  {
    title: "Coin Strike 2",
    description: "Charge Up! New Top Coin Strike 2 Slot!",
    image: "/slider2.jpg",
  },
  {
    title: "Mega Poker",
    description: "Your favorite poker room is back!",
    image: "/slider3.jpg",
    showPlay: true,
  },
];

export default function HeroSlider({
  isLoggedIn = false,
  className = "",
  slides = defaultSlides,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <motion.div
      className={`relative  overflow-hidden  ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 p-8 h-full flex items-center justify-between">
        <div>
          <motion.h1
            className="text-5xl font-bold mb-2 text-white"
            key={slide.title}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {slide.title}
          </motion.h1>
          <motion.p
            className="text-xl text-white mb-6"
            key={slide.description}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {slide.description}
          </motion.p>

        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-8 flex items-center gap-4 z-20">
        <span className="text-sm text-white">
          {currentSlide + 1} / {slides.length}
        </span>
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
