import React, { useEffect, useRef, useState } from "react";
import { useGameSocket } from "../../hooks/useGameSocket";

const PhaseTimer = ({ phase }) => {
  const { lastResults, round } = useGameSocket();
  // the lastresult is = lastResults[0].result
  
  const [progress, setProgress] = useState(0); // goes 0 → 2 (place=0-1, closing=1-2)
  const [showNextGame, setShowNextGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isScaling, setIsScaling] = useState(false);
  const [showLastResult, setShowLastResult] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  const rafRef = useRef(null);
  const startRef = useRef(0);
  const previousTimeRef = useRef(0);

  const DURATION = 7000; // 7s per step
  const TOTAL = DURATION * 2; // 14s total
  const size = 56,
    stroke = 6;
  const r = (size - stroke) / 2,
    C = 2 * Math.PI * r;
  const GAP = 0.08,
    visibleLen = C * (1 - GAP);

  // Show last result when phase changes to result
  useEffect(() => {
    if (phase === "result" && lastResults && lastResults.length > 0) {
      setShowLastResult(true);
      setPulseEffect(true);
      
      // Hide after 3 seconds
      setTimeout(() => {
        setShowLastResult(false);
        setPulseEffect(false);
      }, 3000);
    }
  }, [phase, lastResults]);

  // Betting phase timer
  useEffect(() => {
    if (phase !== "betting") return;

    setProgress(0);
    setTimeLeft(14);
    setIsScaling(false);
    setShowLastResult(false);
    startRef.current = 0;
    previousTimeRef.current = 14;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const p = Math.min(2, ((now - startRef.current) / TOTAL) * 2); // 0 → 2 over 14s
      setProgress(p);

      // Calculate time left
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, TOTAL - elapsed);
      const newTimeLeft = Math.ceil(remaining / 1000);
      
      // Trigger scale effect when time changes during closing phase
      if (newTimeLeft !== previousTimeRef.current && p >= 1 && newTimeLeft < previousTimeRef.current) {
        setIsScaling(true);
        setTimeout(() => setIsScaling(false), 300); // Reset after animation
      }
      
      setTimeLeft(newTimeLeft);
      previousTimeRef.current = newTimeLeft;

      if (p < 2) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  // Show "Next Game Soon" after 2s of spinning
  useEffect(() => {
    let t;
    if (phase === "spinning") {
      setShowNextGame(false);
      t = setTimeout(() => setShowNextGame(true), 2000);
    } else {
      setShowNextGame(false);
    }
    return () => clearTimeout(t);
  }, [phase]);

  if (showNextGame)
    return (
      <div className="text-white text-sm font-semibold uppercase opacity-90 transform translate-y-6 animate-slideUp">
        Next Game Soon
      </div>
    );

  if (phase !== "betting") return null;

  // derive step
  const step = progress < 1 ? "place" : "closing";
  const overallProgress = progress / 2; // normalized 0 → 1 across 14s

  const offset = visibleLen * (1 - overallProgress); // smooth continuous shrink

  // ✅ Dynamic colors based on step
  const strokeColor = step === "place" ? "#22c55e" : "#facc15"; // green → yellow
  const textColor = step === "place" ? "text-white" : "text-yellow-400";

  // Get last result for display
  const lastResult = lastResults && lastResults.length > 0 ? lastResults[0].result : null;

  return (
    <div className="flex flex-col items-center gap-3">
    
      {/* Main Timer */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor}aa)` }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={strokeColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${visibleLen} ${C}`}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 100ms linear" }}
          />
        </svg>

        {/* Countdown Timer Display with Scale Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`text-center ${textColor} transition-all duration-300 ${
              isScaling && step === "closing" 
                ? "scale-125 transform-gpu" 
                : "scale-100"
            }`}
          >
            <div className="text-lg font-bold leading-none">
              {timeLeft}
            </div>
            <div className="text-[8px] leading-none opacity-80">
              SEC
            </div>
          </div>
        </div>

        {/* Pulse effect for engagement */}
        {pulseEffect && (
          <div className="absolute inset-0 animate-ping">
            <div className="w-full h-full rounded-full bg-yellow-400 opacity-20"></div>
          </div>
        )}
      </div>

      {/* Phase Text with Enhanced Styling */}
      <div className="text-center">
        <div
          className={`${textColor} text-xs font-bold tracking-wider uppercase ${
            step === "closing" ? "animate-pulse" : ""
          }`}
        >
          {step === "place" ? "🎯 Place Your Bets" : "⚠️ Bet Closing"}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-2 flex justify-center">
          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-1000"
              style={{ width: `${(progress / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Last Result Display */}
      {showLastResult && lastResult !== null && (
        <div className="text-center animate-bounce">
          <div className="text-sm text-yellow-400 font-bold mb-1">
            🎉 Last Result: {lastResult} 🎉
          </div>
          <div className="text-xs text-gray-400">
            Get ready for next round!
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseTimer;
