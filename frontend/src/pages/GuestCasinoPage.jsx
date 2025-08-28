import React from "react";
import Header from "../components/header";
import bgImage from "/game/bg-autoroulette.webp";
import { useNavigate } from "react-router-dom";
const GuestCasinoPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />

      <div className="min-h-[95vh] flex items-center justify-center relative overflow-hidden">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        ></div>

        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col ">
          {/* Main Content */}
          <div className="flex flex-col mb-2">
            {/* Main Heading */}
            <h1 className="text-2xl md:text-6xl lg:text-3xl  text-white mb-4 leading-tight">
              Game is not available in
              <span className="block text-yellow-400">demo mode</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-lg text-gray-300  max-w-2xl leading-relaxed">
              Log in to start the game
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-500 cursor-pointer w-[10rem] px-10 py-2 rounded"
          >
            Log In
          </button>
        </div>
      </div>
    </>
  );
};

export default GuestCasinoPage;
