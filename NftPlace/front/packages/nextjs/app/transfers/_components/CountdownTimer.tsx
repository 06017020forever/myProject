"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: string;
}

export const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-4 text-center my-4">
      <div className="bg-gray-50 px-6 py-3 rounded-xl">
        <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Days</div>
      </div>
      <div className="bg-gray-50 px-6 py-3 rounded-xl">
        <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Hours</div>
      </div>
      <div className="bg-gray-50 px-6 py-3 rounded-xl">
        <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Minutes</div>
      </div>
      <div className="bg-gray-50 px-6 py-3 rounded-xl">
        <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Seconds</div>
      </div>
    </div>
  );
};