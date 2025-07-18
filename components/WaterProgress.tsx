
import React from 'react';
import { ReminderStatus } from '../types.ts';

interface WaterProgressProps {
  intake: number;
  goal: number;
  timeLeft: number;
  status: ReminderStatus;
}

const WaterProgress: React.FC<WaterProgressProps> = ({ intake, goal, timeLeft, status }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(intake / goal, 1);
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#334155" // slate-700
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#38bdf8" // sky-400
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-bold text-white">{intake} <span className="text-xl font-normal text-slate-400">/ {goal}ml</span></div>
        {status === ReminderStatus.Running ? (
            <div className="text-lg text-sky-400 tracking-wider mt-1">{formatTime(timeLeft)}</div>
        ) : (
            <div className="text-lg text-slate-500 mt-1">Paused</div>
        )}
      </div>
    </div>
  );
};

export default WaterProgress;
