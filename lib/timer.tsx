"use client";

import { useState, useEffect } from "react";

/**
 * Simple countdown timer hook from 50 seconds to 0
 * @returns { seconds, isZero, formattedTime, startCountdown, restartCountdown }
 */
export function useCountdownTimer() {
  const [seconds, setSeconds] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [seconds, isRunning]);

  // Format seconds as MM:SS
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const startCountdown = () => {
    setIsRunning(true);
  };

  const restartCountdown = () => {
    setSeconds(50);
    setIsRunning(true);
  };

  const isZero = seconds === 0;

  return {
    seconds,
    isZero,
    formattedTime: formatTime(),
    startCountdown,
    restartCountdown,
  };
}
