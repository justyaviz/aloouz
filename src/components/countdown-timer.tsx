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
  compact?: boolean;
};

export function CountdownTimer({ className, compact = false }: CountdownTimerProps) {
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
      {!compact ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          Kun yakunigacha
        </p>
      ) : null}
      <div className={compact ? "flex gap-1" : "flex gap-1.5"}>
        {[
          { label: "soat", value: timeLeft.hours },
          { label: "daq", value: timeLeft.minutes },
          { label: "son", value: timeLeft.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className={`text-center ${
              compact
                ? "min-w-[38px] rounded-[10px] border border-[#e0e7f0] bg-[#f4f6f8] px-2 py-1.5"
                : "min-w-[54px] rounded-[14px] border border-[#dce7f2] bg-[#f4f8fb] px-3 py-2"
            }`}
          >
            <p className={`${compact ? "text-base" : "text-lg"} font-semibold tracking-[0.08em] text-foreground`}>
              {item.value}
            </p>
            {!compact ? (
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                {item.label}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
