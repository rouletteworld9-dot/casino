import React, { useState, useEffect } from "react";

const HeroSlider = ({ isLoggedIn }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

const slides = [
  {
    title: "NEON CASINO",
    subtitle:
      "Experience the thrill of Vegas from anywhere. Premium games, live dealers, and massive jackpots await!",
    // gradient: "from-red-400 via-purple-400 to-pink-400",
    // bgGradient: "from-red-600/20 to-purple-600/20",
    image: "/slider1.jpg", 
    primaryButton: "Start Playing Now",
    secondaryButton: "Learn More",
  },
  {
    title: "LIVE DEALERS",
    subtitle:
      "Join real dealers in immersive live casino games. Feel the authentic Vegas atmosphere from your home!",
    // gradient: "from-blue-400 via-cyan-400 to-teal-400",
    // bgGradient: "from-blue-600/20 to-cyan-600/20",
    image: "/slider2.jpg",
    primaryButton: "Join Live Games",
    secondaryButton: "View Tables",
  },
  {
    title: "MEGA JACKPOTS",
    subtitle:
      "Win life-changing amounts with our progressive jackpots. Millions waiting to be claimed!",
    // gradient: "from-yellow-400 via-orange-400 to-red-400",
    // bgGradient: "from-yellow-600/20 to-orange-600/20",
    image: "/slider3.jpg",
    // primaryButton: "Play Jackpots",
    // secondaryButton: "View Winners",
  },
  {
    title: "VIP REWARDS",
    subtitle:
      "Unlock exclusive benefits, personal account managers, and premium bonuses as a VIP member!",
    // gradient: "from-purple-400 via-pink-400 to-rose-400",
    // bgGradient: "from-purple-600/20 to-pink-600/20",
    image: "/slider4.jpg",
    primaryButton: "Become VIP",
    secondaryButton: "Learn Benefits",
  },
];

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
  <img
    key={`bg-image-${currentSlide}`}
    src={currentSlideData.image}
    alt="Slide background"
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
  />

  <div className="container mx-auto relative z-10 flex flex-col justify-center items-start h-full py-20">
    <div key={`title-${currentSlide}`} className="animate-fade-in-up">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text transition-all duration-700 text-white">
        {currentSlideData.title}
      </h1>
    </div>

    <div key={`subtitle-${currentSlide}`} className="animate-fade-in-up delay-200">
      <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl transition-all duration-700">
        {currentSlideData.subtitle}
      </p>
    </div>

    {/* Buttons */}
    {!isLoggedIn &&
      (currentSlideData?.primaryButton || currentSlideData?.secondaryButton) && (
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
          {currentSlideData?.primaryButton && (
            <button className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-red-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
              {currentSlideData.primaryButton}
            </button>
          )}
          {currentSlideData?.secondaryButton && (
            <button className="border-2 border-purple-500 text-purple-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-500 hover:text-white transition-all shadow-lg hover:shadow-xl">
              {currentSlideData.secondaryButton}
            </button>
          )}
        </div>
      )}

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-3 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mt-6 bg-white/10 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white/50 to-white/80 rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
