import React, { useEffect, useRef, useState } from "react";

const PhaseTimer = ({ phase }) => {
  const [progress, setProgress] = useState(0); // goes 0 → 2 (place=0-1, closing=1-2)
  const [showNextGame, setShowNextGame] = useState(false);

  const rafRef = useRef(null);
  const startRef = useRef(0);

  const DURATION = 7000; // 7s per step
  const TOTAL = DURATION * 2; // 14s total
  const size = 56,
    stroke = 6;
  const r = (size - stroke) / 2,
    C = 2 * Math.PI * r;
  const GAP = 0.08,
    visibleLen = C * (1 - GAP);

  // Betting phase timer
  useEffect(() => {
    if (phase !== "betting") return;

    setProgress(0);
    startRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const p = Math.min(2, ((now - startRef.current) / TOTAL) * 2); // 0 → 2 over 14s
      setProgress(p);

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
  const handAngle = overallProgress * 360 - 90; // continuous rotation

  // ✅ Dynamic colors based on step
  const strokeColor = step === "place" ? "#22c55e" : "#facc15"; // green → yellow
  const handColor = step === "place" ? "#16a34a" : "#facc15";
  const textColor = step === "place" ? "text-white" : "text-yellow-400";

  return (
    <div className="flex flex-col items-center gap-2">
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

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r - 6}
            fill="rgba(0,0,0,0.7)"
          />
          <g
            style={{
              transform: `rotate(${handAngle}deg)`,
              transformOrigin: "50% 50%",
              transition: "transform 100ms linear",
            }}
          >
            <line
              x1={size / 2}
              y1={size / 2}
              x2={size / 2}
              y2={size / 2 - (r - 10)}
              stroke={handColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <circle cx={size / 2} cy={size / 2} r="3" fill="#e5ffe9" />
        </svg>
      </div>

      <div
        className={`${textColor} text-xs font-semibold tracking-wide uppercase opacity-90`}
      >
        {step === "place" ? "Place Your Bets" : "Bet Closing"}
      </div>
    </div>
  );
};

export default PhaseTimer;
