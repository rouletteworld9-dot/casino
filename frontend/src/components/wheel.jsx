import anime from "animejs";
import { useCallback } from "react";
import { useEffect } from "react";

const roulette1 = "/assets/roulette_1.jpg";
const roulette2 = "/assets/roulette_2.png";
const roulette3 = "/assets/roulette_3.png";
const roulette4 = "/assets/roulette_4.png";
const roulette5 = "/assets/roulette_5.png";

const Wheel = (props) => {
  // console.log(props , "props")
  var totalNumbers = 37;
  var singleSpinDuration = 5000;
  var singleRotationDegree = 360 / totalNumbers;
  var lastNumber = 0;

  var rouletteWheelNumbers = props.rouletteData.numbers;
  const getRouletteIndexFromNumber = (number) => {
    return rouletteWheelNumbers.indexOf(parseInt(number)); 
  };
  const nextNumber = (number) => {
    var value = number;
    return value;
  };
  const getRotationFromNumber = (number) => {
    var index = getRouletteIndexFromNumber(number);
    return singleRotationDegree * index;
  };

  // rotateTo randomizes the end outcome of the wheel
  // so it doesn't only end at 0 at the top
  const getRandomEndRotation = (minNumberOfSpins, maxNumberOfSpins) => {
    var rotateTo = anime.random(
      minNumberOfSpins * totalNumbers,
      maxNumberOfSpins * totalNumbers
    );

    return singleRotationDegree * rotateTo;
  };
  // calculating where the zero will be at the end of the spin
  // because we are spinning it counter clockwise we are substracting it of 360
  const getZeroEndRotation = (totalRotaiton) => {
    var rotation = 360 - Math.abs(totalRotaiton % 360);

    return rotation;
  };
  // Where the ball end position should be
  // we are calculating this based on the zero rotation
  // and how much the wheel spins
  const getBallEndRotation = (zeroEndRotation, currentNumber) => {
    return Math.abs(zeroEndRotation) + getRotationFromNumber(currentNumber);
  };
  // randomizing the number of spins that the ball should make
  // so every spin is different
  const getBallNumberOfRotations = (minNumberOfSpins, maxNumberOfSpins) => {
    var numberOfSpins = anime.random(minNumberOfSpins, maxNumberOfSpins);
    return 360 * numberOfSpins;
  };

  const spinWheel = useCallback((number) => {
    const bezier = [0.165, 0.84, 0.44, 1.005];
    var ballMinNumberOfSpins = 2;
    var ballMaxNumberOfSpins = 4;
    var wheelMinNumberOfSpins = 2;
    var wheelMaxNumberOfSpins = 4;

    var currentNumber = nextNumber(number);

    var lastNumberRotation = getRotationFromNumber(lastNumber.toString()); //anime.get(wheel, "rotate", "deg");

    // minus in front to reverse it so it spins counterclockwise
    var endRotation = -getRandomEndRotation(
      ballMinNumberOfSpins,
      ballMaxNumberOfSpins
    );
    var zeroFromEndRotation = getZeroEndRotation(endRotation);
    var ballEndRotation =
      getBallNumberOfRotations(wheelMinNumberOfSpins, wheelMaxNumberOfSpins) +
      getBallEndRotation(zeroFromEndRotation, currentNumber);

    // reset to the last number
    anime.set([".layer-2", ".layer-4"], {
      rotate: function () {
        return lastNumberRotation;
      },
    });
    // reset zero
    anime.set(".ball-container", {
      rotate: function () {
        return 0;
      },
    });

    anime({
      targets: [".layer-2", ".layer-4"],
      rotate: function () {
        return endRotation; // random number
      },
      duration: singleSpinDuration, // random duration
      easing: `cubicBezier(${bezier.join(",")})`,
      complete: function () {
        lastNumber = currentNumber;
      },
    });
    // aniamte ball
    anime({
      targets: ".ball-container",
      translateY: [
        { value: 40, duration: 2000 },
        { value: 50, duration: 1000 },
        { value: 60, duration: 900 },
        { value: 80, duration: 1000 },
      ],
      rotate: [{ value: ballEndRotation, duration: singleSpinDuration }],
      loop: 0,
      easing: `cubicBezier(${bezier.join(",")})`,
    });
  }, []);

  
  useEffect(() => {
    var nextNubmer = props.number.next;

    if (nextNubmer != null && nextNubmer !== "") {
      var nextNumberInt = parseInt(nextNubmer);
      spinWheel(nextNumberInt);
      // setTimeout(() => props.startAgain(), 5000); // Automatically start playing again after 5 seconds
    }
  }, [props.number]);

  const style = {
    backgroundImage: `url(${roulette1})`,
    width: "280px",
    height: "280px",
    position: "relative",
    left: 65,
    top: -120,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div style={style} className={"roulette-wheel "}>
      <div
        style={{
          backgroundImage: `url(${roulette2})`,
          transform: "rotate(0deg)",
        }}
        className={"layer-2 wheel"}
      ></div>
      <div
        style={{ backgroundImage: `url(${roulette3})` }}
        className={"layer-3"}
      ></div>
      <div
        className={"layer-4 wheel"}
        style={{
          transform: "rotate(0deg)",
          backgroundImage: `url(${roulette4})`,
        }}
      ></div>
      <div
        style={{ backgroundImage: `url(${roulette5})` }}
        className={"layer-5"}
      ></div>
      <div className={"ball-container"} style={{ transform: "rotate(0deg)" }}>
        <div
          className={"ball"}
          style={{ transform: "translate(0, -143.221px)" }}
        ></div>
      </div>
    </div>
  );
};

export default Wheel;
