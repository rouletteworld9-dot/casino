import anime from "animejs";
import React, { useCallback } from "react";
import { useEffect } from "react";

const roulette1 = "/assets/roulette_1.png";
const roulette2 = "/assets/roulette_2.png";
const roulette3 = "/assets/roulette_3.png";
const roulette4 = "/assets/roulette_4.png";
const roulette5 = "/assets/roulette_5.png";

const startIdleRotation = () => {
  anime({
    targets: [".layer-2", ".layer-4"],
    rotate: "-=360deg",
    duration: 2000, // slow, realistic spin
    easing: "linear",
    loop: true,
  });
};

const showBall = () => {
  const el = document.querySelector(".ball-container");
  if (el) el.style.display = "block";
};

const hideBall = () => {
  const el = document.querySelector(".ball-container");
  if (el) el.style.display = "none";
};

const Wheel = (props) => {
  var totalNumbers = 37;
  var singleSpinDuration = 4000;
  var singleRotationDegree = 360 / totalNumbers;
  var lastNumber = 0;

  const isSmallScreen = window.innerWidth < 768; // you can adjust breakpoint
  const lastValue = isSmallScreen ? 73 : 90;

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
    const bezier = [0.205, 0.184, 0.244, 1.005];
    var ballMinNumberOfSpins = 1;
    var ballMaxNumberOfSpins = 2;
    var wheelMinNumberOfSpins = 1;
    var wheelMaxNumberOfSpins = 2;

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
      duration: singleSpinDuration,
      easing: `cubicBezier(${bezier.join(",")})`,
      complete: function () {
        lastNumber = currentNumber;
        // ✅ Restart idle rotation 2s after final spin stops
        setTimeout(() => {
          startIdleRotation();
        }, 2000);
      },
    });
    // aniamte ball
    anime({
      targets: ".ball-container",
      translateY: [
        { value: 40, duration: 2000 },
        { value: 50, duration: 1000 },
        { value: 60, duration: 900 },
        { value: lastValue, duration: 1000 },
      ],
      rotate: [{ value: ballEndRotation, duration: singleSpinDuration }],
      loop: 0,
      easing: `cubicBezier(${bezier.join(",")})`,
    });
  }, []);

  useEffect(() => {
    const nextNumber = props.number.next;

    if (props.phase === "betting") {
      // clear old animations
      anime.remove([".layer-2", ".layer-4", ".ball-container"]);
      // start idle rotation
      startIdleRotation();
    }

    if (props.phase === "spinning") {
      // stop idle rotation first
      showBall();
      anime.remove([".layer-2", ".layer-4", ".ball-container"]);

      // reset ball
      anime.set(".ball-container", {
        rotate: 0,
        translateY: 40,
      });

      // fast continuous spin until result
      anime({
        targets: [".layer-2", ".layer-4"],
        rotate: "-=360deg",
        duration: 2000,
        easing: "linear",
        loop: true,
      });

      anime({
        targets: ".ball-container",
        rotate: "+=360deg",
        translateY: [{ value: 30 }],
        duration: 1000,
        easing: "linear",
        loop: true,
      });
    }

    if (nextNumber != null && props.phase === "result") {
      const nextNumberInt = parseInt(nextNumber);
      showBall();

      // stop continuous rotation before final spin
      anime.remove([".layer-2", ".layer-4", ".ball-container"]);

      // run final spin + ball drop (spinWheel will handle restart later)
      spinWheel(nextNumberInt);
      // so here: hide ball after 2s as well
      setTimeout(() => {
        hideBall();
      }, singleSpinDuration + 2000); // wait for spin duration + 2s pause
    }
  }, [props.number, props.phase]);

  const style = {
    backgroundImage: `url(${roulette1})`,
    width: "min(60vw, 280px)", // responsive: 80% of screen width but max 280px
    height: "min(60vw, 280px)", // keep it square
    margin: "0 auto",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: 500,
  };

  return (
    <div
      style={style}
      className={
        "  roulette-wheel relative left-[65px] -top-[70px] lg:-top-[120px]"
      }
    >
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
          // style={{ transform: "translate(0, -146.221px)" }}
        ></div>
      </div>
    </div>
  );
};

export default React.memo(Wheel);
