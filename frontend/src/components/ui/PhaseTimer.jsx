import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useGameStore } from "../../stores/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
const PhaseTimer = () => {
  // Only subscribe to the specific values we need from the store
  const phase = useGameStore((state) => state.phase);
  const lastResults = useGameStore((state) => state.lastResults);

  const [progress, setProgress] = useState(0);
  const [showNextGame, setShowNextGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isScaling, setIsScaling] = useState(false);
  const [showLastResult, setShowLastResult] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  const rafRef = useRef(null);
  const startRef = useRef(0);
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

  // Optimized betting phase timer
  useEffect(() => {
    if (phase !== "betting") {
      cleanup();
      return;
    }

    // Reset state
    setProgress(0);
    setTimeLeft(14);
    setIsScaling(false);
    setShowLastResult(false);
    startRef.current = 0;
    previousTimeRef.current = 14;

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;

      const elapsed = now - startRef.current;
      const p = Math.min(2, (elapsed / TOTAL) * 2);
      setProgress(p);

      const remaining = Math.max(0, TOTAL - elapsed);
      const newTimeLeft = Math.ceil(remaining / 1000);

      // Trigger scale effect during closing phase
      if (
        newTimeLeft !== previousTimeRef.current &&
        p >= 1 &&
        newTimeLeft < previousTimeRef.current
      ) {
        setIsScaling(true);
        setPulseEffect(true);
        setTimeout(() => setIsScaling(false), 300);
      }

      setTimeLeft(newTimeLeft);
      previousTimeRef.current = newTimeLeft;

      if (p < 2) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return cleanup;
  }, [phase, TOTAL, cleanup]);

  // Optimized next game effect
  useEffect(() => {
    if (phase === "spinning") {
      setShowNextGame(false);
      setShowNextGame(true)
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
            className="fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-50"
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
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
      {/* Main Timer */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
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
            // style={{ transition: "stroke-dashoffset 100ms linear" }}
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
            <div className="text-lg font-bold leading-none">{timeLeft}</div>
            <div className="text-[8px] leading-none opacity-80">SEC</div>
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
          className={`${textColor} text-xs font-bold tracking-wider uppercase ${
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
