import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface AssessmentTimerProps {
  /** Total allowed time in minutes */
  timeLimitMinutes: number;
  /** ISO date string of when the session started */
  startedAt: string;
  /** Called when time runs out */
  onTimeUp: () => void;
}

/**
 * Countdown timer for an assessment session.
 * Shows MM:SS, turns amber < 5 min, red < 1 min, pulses < 30s.
 */
const AssessmentTimer = ({ timeLimitMinutes, startedAt, onTimeUp }: AssessmentTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
    return Math.max(0, timeLimitMinutes * 60 - Math.floor(elapsed));
  });
  const calledRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTimeUp = useCallback(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      onTimeUp();
    }
  }, [onTimeUp]);

  useEffect(() => {
    if (secondsLeft <= 0) handleTimeUp();
  }, [secondsLeft, handleTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = secondsLeft <= 300 && secondsLeft > 60; // < 5 min
  const isCritical = secondsLeft <= 60; // < 1 min
  const isPulse = secondsLeft <= 30;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold transition-colors
        ${isCritical
          ? `bg-red-100 text-red-700 border border-red-300 ${isPulse ? 'animate-pulse' : ''}`
          : isWarning
          ? 'bg-amber-100 text-amber-700 border border-amber-300'
          : 'bg-gray-100 text-gray-700 border border-gray-200'
        }
      `}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      {formatted}
    </div>
  );
};

export default AssessmentTimer;
