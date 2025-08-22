// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";

// const WHEEL_NUMBERS = [
//   0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
//   16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
// ];

// export const useContinousSpinner = (phase, lastResults) => {
//   const totalNumbers = 37;
//   const singleRotationDegree = 360 / totalNumbers;

//   const [wheelRotation, setWheelRotation] = useState(0);
//   const [ballRotation, setBallRotation] = useState(0);
//   const [result, setResult] = useState(null);

//   const wheelRotationRef = useRef(0);
//   const ballRotationRef = useRef(0);

//   // GSAP refs
//   const tlRef = useRef(null);
//   const slowDownTweenRef = useRef(null);

//   // Persistent ball speed object for GSAP (deg per frame tick)
//   const ballSpeedObjRef = useRef({ speed: 4 });

//   // Result-phase control
//   const resultActiveRef = useRef(false);
//   const resultTargetRef = useRef(null);
//   const resultSpeedRef = useRef(1); // slow speed used in spinning after 5s
//   const resultTimerRef = useRef(null);

//   // ------------------ WHEEL / BALL LOOP ------------------
//   useEffect(() => {
//     let frame;

//     const loop = () => {
//       // Wheel rotation: slower when spinning
//       if (phase === "betting" || phase === "spinning") {
//         setWheelRotation((prev) => {
//           const next = prev + (phase === "spinning" ? 0.5 : 1);
//           wheelRotationRef.current = next;
//           return next;
//         });
//       }

//       // Ball rotation during betting/spinning using GSAP-controlled speed
//       if (phase === "betting" || phase === "spinning") {
//         setBallRotation((prev) => {
//           const next = prev + ballSpeedObjRef.current.speed;
//           ballRotationRef.current = next;
//           return next;
//         });
//       }

//       // Ball rotation during result: move at slow speed until target reached
//       if (phase === "result" && resultActiveRef.current) {
//         setBallRotation((prev) => {
//           const speed = resultSpeedRef.current;
//           const next = prev + speed;

//           if (next >= resultTargetRef.current) {
//             ballRotationRef.current = resultTargetRef.current;
//             resultActiveRef.current = false;
//             return resultTargetRef.current;
//           }

//           ballRotationRef.current = next;
//           return next;
//         });
//       }

//       frame = requestAnimationFrame(loop);
//     };

//     frame = requestAnimationFrame(loop);

//     // After 5s in spinning, slow the ball using GSAP
//     if (phase === "spinning") {
//       slowDownTweenRef.current = gsap.to(ballSpeedObjRef.current, {
//         delay: 3,
//         duration: 3, // smooth deceleration
//         speed: 1, // final slow speed (deg per frame)
//         ease: "power2.out",
//       });
//     }

//     return () => {
//       cancelAnimationFrame(frame);
//       if (slowDownTweenRef.current) slowDownTweenRef.current.kill();
//     };
//   }, [phase]);

//   // ------------------ RESULT PHASE ------------------
//   useEffect(() => {
//     if (phase === "result" && lastResults?.length > 0) {
//       const number = lastResults[0].result;

//       // Show result text faster
//       if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
//       resultTimerRef.current = setTimeout(
//         () => setResult(number.toString()),
//         100
//       );

//       // Kill any old animations
//       if (tlRef.current) tlRef.current.kill();

//       // Normalize wheel angle
//       const finalWheel = ((wheelRotationRef.current));

//       // Find pocket index and angle
//       const pocketIndex = WHEEL_NUMBERS.indexOf(number);
//       const pocketAngle = pocketIndex * singleRotationDegree;

//       // Compute target ball angle
//       const currentBall = ballRotationRef.current;
//       const targetAngle = finalWheel + pocketAngle;

//       // Compute clockwise delta only
//       let delta = targetAngle - currentBall;
//       if (delta < 0) delta += 360; // ensure clockwise rotation

//       // Animate ball to target smoothly
//       tlRef.current = gsap.timeline();
//       tlRef.current.to(ballRotationRef, {
//         current: currentBall + delta,
//         duration: 1.5, // smooth and not too slow
//         ease: "power3.out",
//         onUpdate: () => setBallRotation(ballRotationRef.current),
//       });
//     }

//     return () => {
//       if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
//     };
//   }, [phase, lastResults, singleRotationDegree]);

//   return {
//     wheelRotation,
//     ballRotation,
//     result,
//   };
// };

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export const useContinousSpinner = (phase, lastResults) => {
  const totalNumbers = 37;
  const singleRotationDegree = 360 / totalNumbers;

  const [wheelRotation, setWheelRotation] = useState(0);
  const [ballRotation, setBallRotation] = useState(0);
  const [result, setResult] = useState(null);

  const wheelRotationRef = useRef(0);
  const ballRotationRef = useRef(0);

  const tlRef = useRef(null);
  const slowDownTweenRef = useRef(null);

  const ballSpeedObjRef = useRef({ speed: 4 });

  const lastResultPocketRef = useRef(null); // store last result pocket angle

  // ------------------ WHEEL / BALL LOOP ------------------
  useEffect(() => {
    let frame;

    const loop = () => {
      // Wheel rotation: anticlockwise
      if (phase === "betting" || phase === "spinning") {
        setWheelRotation((prev) => {
          const next = prev - (phase === "spinning" ? 0.5 : 1);
          wheelRotationRef.current = next;
          return next;
        });
      }

      // Ball behavior
      if (phase === "spinning") {
        // Ball spins freely clockwise
        setBallRotation((prev) => {
          const next = prev + ballSpeedObjRef.current.speed;
          ballRotationRef.current = next;
          return next;
        });
      } else if (phase === "betting" && lastResultPocketRef.current !== null) {
        // Ball sticks to the last result pocket: rotates along with wheel
        setBallRotation(() => {
          const angle = wheelRotationRef.current + lastResultPocketRef.current;
          ballRotationRef.current = angle;
          return angle;
        });
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    // Smooth slow down in spinning
    if (phase === "spinning") {
      slowDownTweenRef.current = gsap.to(ballSpeedObjRef.current, {
        delay: 1,
        duration: 3,
        speed: 4,
        ease: "power2.out",
      });
    }

    return () => {
      cancelAnimationFrame(frame);
      if (slowDownTweenRef.current) slowDownTweenRef.current.kill();
    };
  }, [phase]);

  // ------------------ RESULT PHASE ------------------
  useEffect(() => {
    if (phase === "result" && lastResults?.length > 0) {
      const number = lastResults[0].result;
      setResult(number.toString());

      // Store last pocket for betting phase
      lastResultPocketRef.current =
        WHEEL_NUMBERS.indexOf(number) * singleRotationDegree;

      if (tlRef.current) tlRef.current.kill();

      // Normalize wheel
      const finalWheel = wheelRotationRef.current;

      const pocketIndex = WHEEL_NUMBERS.indexOf(number);
      const pocketAngle = pocketIndex * singleRotationDegree;

      const currentBall = ballRotationRef.current;
      const delta = (finalWheel + pocketAngle - currentBall + 360) ;
      const target = currentBall + delta;

      tlRef.current = gsap.timeline();
      tlRef.current.to(ballRotationRef, {
        current: target,
        duration: 1,
        ease: "power3.out",
        onUpdate: () => setBallRotation(ballRotationRef.current),
      });
    }
  }, [phase, lastResults, singleRotationDegree]);

  return {
    wheelRotation,
    ballRotation,
    result,
  };
};
