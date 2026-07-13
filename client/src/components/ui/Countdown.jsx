import { useEffect, useState } from "react";

function getRemaining(target) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown({ target, onComplete, className = "" }) {
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const interval = setInterval(() => {
      const r = getRemaining(target);
      setRemaining(r);
      if (!r) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!remaining) {
    return <span className={className}>Ended</span>;
  }

  const { days, hours, minutes, seconds } = remaining;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <span className={className}>
      {days > 0 && `${days}d `}
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}
