import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ResultHistory from "./ResultHistory";
import ResultAdjuster from "./ResultAdjuster";

const Dashboard = () => {
  const [currentPeriod, setCurrentPeriod] = useState("20250808010402");
  const [countdown, setCountdown] = useState(21); 


  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         // Generate new period and reset countdown
  //         const newPeriod = generateNewPeriod();
  //         setCurrentPeriod(newPeriod);
  //         return 60; // Reset to 60 seconds
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  const generateNewPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hour}${minute}${second}`;
  };




  return (
    <div className="space-y-6 p-6 bg-midnightPurple min-h-screen rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-white">Dashboard V5</h2>
      </div>

      {/* Current Period and Countdown */}
      <div className="bg-blue-400 text-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Period: {currentPeriod}</span>
          <span className="font-bold text-xl">
            {String(Math.floor(countdown / 60)).padStart(2, "0")}:
            {String(countdown % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Result History Table */}
      <ResultHistory/>

      
      <ResultAdjuster/>
    </div>
  );
};

export default Dashboard;
