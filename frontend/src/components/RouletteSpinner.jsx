// import { rouletteData } from "../types";
import { useContinuousRoulette } from "../hooks/useRouletteSpin";
import "../components/RouletteSpinner.css";

const RouletteSpinner = ({ rouletteData }) => {
  const { wheelRotation, ballRotation, ballTranslateY, result } =
    useContinuousRoulette(rouletteData);

  return (
    <div style={wheelStyle}>
      {layers.map(({ img, rotatable }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "280px 280px",
            transform: rotatable ? `rotate(${wheelRotation}deg)` : "none",
          }}
        />
      ))}
      <div style={ballContainerStyle}>
        <div style={ballStyle} />
      </div>
    </div>
  );
};

export default RouletteSpinner;
