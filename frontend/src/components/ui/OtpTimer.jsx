import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * OTP Timer Component
 * @param {Object} props
 * @param {number} [props.durationMs=60000] - Countdown duration in ms
 * @param {function} props.onExpire - Called when timer hits 0
 * @param {function} [props.onTick] - Called every second with remaining seconds
 * @param {string|number} [props.keyTrigger] - When changed, timer resets
 */
export default function OtpTimer({
  durationMs = 60000,
  onExpire,
  onTick,
  keyTrigger,
}) {
  const [remaining, setRemaining] = useState(durationMs);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef();
  const expiredToastRef = useRef(false);

  // Reset timer on keyTrigger or duration change
  useEffect(() => {
    setRemaining(durationMs);
    setExpired(false);
    expiredToastRef.current = false;
  }, [keyTrigger, durationMs]);

  // Timer logic
  useEffect(() => {
    if (expired) return;
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalRef.current);
          setExpired(true);
          if (!expiredToastRef.current) {
            toast.error("OTP expired");
            expiredToastRef.current = true;
          }
          if (onExpire) onExpire();
          return 0;
        }
        if (onTick) onTick(Math.floor((prev - 1000) / 1000));
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [expired, keyTrigger, durationMs]);

  // Format MM:SS
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="flex items-center justify-center min-h-[2.5rem]">
      <span
        className={`text-lg md:text-xl font-semibold tracking-widest select-none ${
          expired ? "text-red-500" : "text-purple-600"
        }`}
      >
        {mm}:{ss}
      </span>
    </div>
  );
}
