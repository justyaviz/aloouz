"use client";

import { useEffect, useState } from "react";

function getTimeLeft() {
  const now = new Date();
  const target = new Date();
  target.setHours(23, 59, 59, 999);

  const diff = Math.max(target.getTime() - now.getTime(), 0);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

type CountdownTimerProps = {
  className?: string;
};

export function CountdownTimer({ className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className={className}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
        Kun yakunigacha
      </p>
      <div className="flex gap-1.5">
        {[
          { label: "soat", value: timeLeft.hours },
          { label: "daq", value: timeLeft.minutes },
          { label: "son", value: timeLeft.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="min-w-[54px] rounded-[14px] border border-[#dce7f2] bg-[#f4f8fb] px-3 py-2 text-center"
          >
            <p className="text-lg font-semibold tracking-[0.08em] text-foreground">{item.value}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
