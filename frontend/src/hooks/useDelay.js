// useDelay.js
import { useEffect, useState } from "react";

export const useDelay = (value, delay) => {
  const [delayedValue, setDelayedValue] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDelayedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return delayedValue;
};
