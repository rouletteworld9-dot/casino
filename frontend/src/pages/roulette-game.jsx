import { useEffect, useState } from "react";
import RouletteSpinner from "../components/RouletteSpinner";

const defaultData = {
  numbers: Array.from({ length: 37 }, (_, i) => i),
};

const SPIN_INTERVAL = 15000; // 15 seconds

const RouletteGame = () => {
  const [number, setNumber] = useState({ next: "" });
  const [result, setResult] = useState(null);

  // Trigger new spin every 15 seconds
  useEffect(() => {
    const spinLoop = setInterval(() => {
      const next = Math.floor(Math.random() * 37).toString();
      setNumber({ next });
      setResult(null); // Reset result while spinning
    }, SPIN_INTERVAL);

    return () => clearInterval(spinLoop);
  }, []);

  // Show result after spin (delay slightly after animation finishes)
  useEffect(() => {
    if (number.next !== "") {
      const resultTimeout = setTimeout(() => {
        setResult(number.next);
      }, 5500); // Wait for animation to finish

      return () => clearTimeout(resultTimeout);
    }
  }, [number]);

  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1>Roulette Spin</h1>
      <RouletteSpinner
        rouletteData={defaultData}
        number={number}
        startAgain={() => {}}
      />
      <h2>
        {result !== null ? (
          <span>
            🎉 Result: <strong>{result}</strong>
          </span>
        ) : (
          <span>Spinning...</span>
        )}
      </h2>
    </div>
  );
};

export default RouletteGame;
