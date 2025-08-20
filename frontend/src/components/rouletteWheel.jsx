import { JSX } from "react";
import { rouletteData } from "../types";
import { useContinuousRoulette } from "../hooks/useRouletteSpin";
import "../components/rouletteWheel.css";

const RouletteWheel = ({ rouletteData }) => {
  const { wheelRotation, ballRotation, ballTranslateY, result } =
    useContinuousRoulette(rouletteData);

  return (
    <div style={{ textAlign: "center" }}>
      <div className="roulette-wheel">
        <div
          className="layer-2"
          style={{
            transform: `rotate(${wheelRotation}deg)`,
            transition: `transform 0.1s linear`,
          }}
        />
        <div className="layer-3" />
        <div
          className="layer-4"
          style={{
            transform: `rotate(${wheelRotation}deg)`,
            transition: `transform 0.1s linear`,
          }}
        />
        <div className="layer-5" />
        <div
          className="ball-container"
          style={{
            transform: `rotate(${ballRotation}deg)`,
            transition: `transform 2s ease`,
          }}
        >
          <div
            className="ball"
            style={{
              transform: `translateY(-${116 - ballTranslateY}px)`,
              transition: `transform 1s ease`,
            }}
          />
        </div>
      </div>

      {result && <h2>🎯 Result: {result}</h2>}
    </div>
  );
};

export default RouletteWheel;
