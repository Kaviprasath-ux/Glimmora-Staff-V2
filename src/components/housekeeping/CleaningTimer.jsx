import { useState, useEffect } from 'react';

export default function CleaningTimer({ startedAt, estimatedMinutes, isPaused = false, size = 'md' }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt || isPaused) return;

    const startTime = new Date(startedAt).getTime();

    const updateElapsed = () => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      setElapsed(Math.floor(elapsedMs / 1000));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startedAt, isPaused]);

  const elapsedMinutes = Math.floor(elapsed / 60);
  const elapsedSeconds = elapsed % 60;
  const isOvertime = elapsedMinutes >= estimatedMinutes;
  const progress = Math.min((elapsedMinutes / estimatedMinutes) * 100, 100);

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      text: 'text-xs',
      label: 'text-[10px]',
    },
    md: {
      container: 'w-20 h-20',
      text: 'text-sm',
      label: 'text-xs',
    },
    lg: {
      container: 'w-24 h-24',
      text: 'text-base',
      label: 'text-xs',
    },
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${classes.container}`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="4"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={isOvertime ? '#EF4444' : isPaused ? '#CDB261' : '#5C9BA4'}
            strokeWidth="4"
            strokeDasharray={`${progress * 2.83} 283`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold ${classes.text} ${isOvertime ? 'text-red-500' : 'text-[#4E5840]'}`}>
            {formatTime(elapsedMinutes, elapsedSeconds)}
          </span>
          {isPaused && (
            <span className="text-[10px] text-[#CDB261] font-medium">PAUSED</span>
          )}
        </div>
      </div>
      <div className="text-center">
        <span className={`${classes.label} text-[#6B6F63]`}>
          Est: {estimatedMinutes}m
        </span>
      </div>
    </div>
  );
}
