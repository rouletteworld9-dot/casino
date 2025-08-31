import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useGameStore } from "../../stores/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import useCountdown from "../../hooks/useCountdown";

const PhaseTimer = () => {
  const phase = useGameStore((state) => state.phase);
  const lastResults = useGameStore((state) => state.lastResults);

  const { remaining, formatted } = useCountdown();

  const [progress, setProgress] = useState(0);
  const [showNextGame, setShowNextGame] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [showLastResult, setShowLastResult] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  const rafRef = useRef(null);
  const previousTimeRef = useRef(0);
  const phaseRef = useRef(phase);

  // Constants - moved outside component or memoized to prevent recreation
  const CONSTANTS = useMemo(
    () => ({
      DURATION: 7000,
      TOTAL: 14000,
      SIZE: 56,
      STROKE: 6,
      GAP: 0.08,
    }),
    []
  );

  const { DURATION, TOTAL, SIZE, STROKE, GAP } = CONSTANTS;

  // Memoized calculations
  const circleProps = useMemo(() => {
    const r = (SIZE - STROKE) / 2;
    const C = 2 * Math.PI * r;
    const visibleLen = C * (1 - GAP);
    return { r, C, visibleLen };
  }, [SIZE, STROKE, GAP]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Optimized result display effect
  useEffect(() => {
    // Only run if phase actually changed to result
    if (
      phase === "result" &&
      phaseRef.current !== "result" &&
      lastResults?.length > 0
    ) {
      setShowLastResult(false);
      setPulseEffect(false);

      const timer = setTimeout(() => {
        setShowLastResult(true);
        // setPulseEffect(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
    phaseRef.current = phase;
  }, [phase, lastResults?.length]); // Only depend on length, not the entire array

  // Simplified betting phase timer using useCountdown data
  useEffect(() => {
    if (phase !== "betting" || remaining === null) {
      cleanup();
      setProgress(0);
      return;
    }

    // Calculate progress based on remaining time (assuming 15 second total)
    const total = 15; // 15 seconds total
    const elapsed = total - remaining;
    const p = Math.min(2, (elapsed / total) * 2);
    setProgress(p);

    // Trigger pulse and scaling effects
    if (
      remaining !== previousTimeRef.current &&
      p >= 1 &&
      remaining < previousTimeRef.current &&
      remaining > 0
    ) {
      setIsScaling(true);
      setPulseEffect(true);
      setTimeout(() => setIsScaling(false), 300);
    }

    previousTimeRef.current = remaining;
  }, [phase, remaining, cleanup]);

  // Optimized next game effect
  useEffect(() => {
    if (phase === "spinning") {
      setShowNextGame(false);
      setShowNextGame(true);
      const timer = setTimeout(() => setShowNextGame(true), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowNextGame(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    const step = progress < 1 ? "place" : "closing";
    const overallProgress = progress / 2;
    const offset = circleProps.visibleLen * (1 - overallProgress);
    const strokeColor = step === "place" ? "#22c55e" : "#facc15";
    const textColor = step === "place" ? "text-white" : "text-yellow-400";

    return { step, overallProgress, offset, strokeColor, textColor };
  }, [progress, circleProps.visibleLen]);

  // Get last result - memoized
  const lastResult = useMemo(() => {
    return lastResults?.length > 0 ? lastResults[0].result : null;
  }, [lastResults]);

  // Early returns for different states
  if (showNextGame) {
    return (
      <AnimatePresence mode="wait">
        {showNextGame && (
          <motion.div
            key="waiting-overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="sm:flex hidden fixed inset-0 w-screen h-screen bg-black/30  items-center justify-center z-50"
          >
            <motion.div
              key="waiting-text"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="shine-text text-lg font-semibold uppercase opacity-90"
            >
              Waiting For the Result...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (phase !== "betting") return null;

  const { step, offset, strokeColor, textColor } = computedValues;

  return (
    <div
      className="fixed 
    top-12 sm:top-auto   /* only top on small, reset on sm */
    bottom-auto sm:bottom-18 
    right-0 sm:right-auto
    left-auto sm:left-1/2 sm:-translate-x-1/2
    z-[999] flex flex-col items-center gap-2 sm:gap-3"
    >
      {/* Main Timer */}
      <div
        className="relative"
        style={{
          width: window.innerWidth < 640 ? SIZE * 0.7 : SIZE, // shrink timer <sm
          height: window.innerWidth < 640 ? SIZE * 0.7 : SIZE,
        }}
      >
        <svg
          width={window.innerWidth < 640 ? SIZE * 0.7 : SIZE}
          height={window.innerWidth < 640 ? SIZE * 0.7 : SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor}aa)` }}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={circleProps.r}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
            fill="none"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={circleProps.r}
            stroke={strokeColor}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circleProps.visibleLen} ${circleProps.C}`}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Countdown Timer Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-center ${textColor} transition-all duration-300 ${
              isScaling && step === "closing"
                ? "scale-125 transform-gpu"
                : "scale-100"
            }`}
          >
            <div className="text-xs sm:text-lg font-bold leading-none">
              {remaining !== null ? remaining : 0}
            </div>
            <div className="text-[5px] sm:text-[8px] leading-none opacity-80">
              SEC
            </div>
          </div>
        </div>

        {/* Pulse effect */}
        {pulseEffect && (
          <div className="absolute inset-0 animate-ping">
            <div className="w-full h-full rounded-full bg-yellow-400 opacity-20"></div>
          </div>
        )}
      </div>

      {/* Phase Text */}
      <div className="text-center">
        <div
          className={`${textColor} hidden sm:flex sm:text-xs font-bold tracking-wider uppercase ${
            step === "closing" ? "animate-pulse" : ""
          }`}
        >
          {step === "place" ? "🎯 Place Your Bets" : "⚠️ Bet Closing"}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PhaseTimer);
