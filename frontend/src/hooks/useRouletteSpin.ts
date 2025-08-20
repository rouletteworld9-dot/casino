import { useCallback, useEffect, useRef, useState } from "react";
import { rouletteData } from "../types";

export const useContinuousRoulette = (data: rouletteData) => {
  const totalNumbers = 37;
  const singleRotationDegree = 360 / totalNumbers;

  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const [ballTranslateY, setBallTranslateY] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const spinning = useRef(true);
  const startPauseTimeout = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null);

  const rotateWheel = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;

    if (spinning.current) {
      setWheelRotation((prev) => (prev + delta * 0.03) % 360);
    }

    lastTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(rotateWheel);
  }, []);

  // Start spinning
  useEffect(() => {
    requestRef.current = requestAnimationFrame(rotateWheel);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (startPauseTimeout.current) clearTimeout(startPauseTimeout.current);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  // Start the 15s spin-pause-show-result loop
  useEffect(() => {
    const loop = () => {
      startPauseTimeout.current = setTimeout(() => {
        // Stop spinning
        spinning.current = false;

        const nextNumber = Math.floor(Math.random() * 37);
        const ballTargetRotation =
          (360 - nextNumber * singleRotationDegree) % 360;

        setBallTranslateY(0);
        setTimeout(() => setBallTranslateY(10), 500);
        setTimeout(() => setBallTranslateY(25), 1000);

        setResult(nextNumber.toString());
        setBallRotation(ballTargetRotation);

        // Resume after showing result
        resumeTimeout.current = setTimeout(() => {
          setResult(null);
          setBallRotation(0);
          spinning.current = true;
          loop(); // Repeat loop
        }, 3000);
      }, 15000);
    };

    loop();
  }, []);

  return {
    wheelRotation,
    ballRotation,
    ballTranslateY,
    result,
  };
};
