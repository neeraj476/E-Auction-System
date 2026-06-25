import { useState, useEffect } from "react";
import { calculateCountdownParts } from "../utils/format";

export const useCountdown = (endTime) => {
  const [countdown, setCountdown] = useState(() => calculateCountdownParts(endTime));

  useEffect(() => {
    if (!endTime) return;
    setCountdown(calculateCountdownParts(endTime));
    const timer = setInterval(() => {
      setCountdown(calculateCountdownParts(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return countdown; // { label, isOver }
};