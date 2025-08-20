import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-deepPurple  to-midnightPurple text-white font-poppins px-4">
        <h1 className="text-8xl md:text-[10rem] font-extrabold mb-6 animate-pulse">
          404
        </h1>
        <p className="text-2xl md:text-3xl mb-8 text-gray-300">
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
