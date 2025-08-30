import ResultHistory from "./ResultHistory";
import ResultAdjuster from "./ResultAdjuster";
import { useGameStore } from "../../stores/useGameStore";
import React from "react";

const CurrentPeriod = React.memo(() => {
  const round = useGameStore((state) => state.round);
  const phase = useGameStore((state) => state.phase);

  return (
    <div className="bg-blue-400 text-white p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="font-semibold ">Period: {round}</span>
        <span className="font-bold text-xl capitalize ">{phase}</span>
      </div>
    </div>
  );
});

const Dashboard = () => {
  
  return (
    <div className="space-y-6 p-6 bg-midnightPurple min-h-screen rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-white">Dashboard V5</h2>
      </div>

      {/* Current Period and Countdown */}
      <CurrentPeriod />

      {/* Result History Table */}
      <ResultHistory />

      <ResultAdjuster />
    </div>
  );
};

export default Dashboard;
