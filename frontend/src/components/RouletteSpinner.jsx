import { useContinousSpinner } from "../hooks/useContinousSpinner";

const RouletteSpinner = ({ phase, lastResults }) => {
  const { wheelRotation, ballRotation } = useContinousSpinner(
    phase,
    lastResults
  );

  const wheelStyle = {
    width: 280,
    height: 280,
    borderRadius: "50%",
    backgroundImage: `url(/Assets/roulette_1.jpg)`,
    backgroundSize: "280px 280px",
    boxShadow: "2px 10px 30px rgba(0,0,0,0.4)",
    position: "relative",
    margin: "auto",
  };

  const ballContainerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: `rotate(${ballRotation}deg)`,
  };

  const ballStyle = {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#fff radial-gradient(circle at 5px 5px, #fff, #444)",
    boxShadow: "1px 1px 4px #000",
    transform: `translateY(-116px)`,
    top: "60%",
    left: "50%",
    margin: -3,
  };

  const layers = [
    { img: "/Assets/roulette_2.png", rotatable: true },
    { img: "/Assets/roulette_3.png", rotatable: false },
    { img: "/Assets/roulette_4.png", rotatable: true },
    { img: "/Assets/roulette_5.png", rotatable: false },
  ];

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
