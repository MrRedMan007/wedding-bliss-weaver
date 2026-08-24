import { useEffect, useState } from "react";

import { useI18n } from "@/i18n";

function diff(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown({ target }: { target: Date }) {
  const { t } = useI18n();
  const [left, setLeft] = useState<ReturnType<typeof diff>>(null);

  useEffect(() => {
    setLeft(diff(target));
    const id = window.setInterval(() => setLeft(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!left) {
    return (
      <p className="text-center text-lg text-primary">{t("countdown.started")}</p>
    );
  }

  const cells = [
    { value: left.days, label: t("countdown.days") },
    { value: left.hours, label: t("countdown.hours") },
    { value: left.minutes, label: t("countdown.minutes") },
    { value: left.seconds, label: t("countdown.seconds") },
  ];

  return (
    <div>
      <p className="text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
        {t("countdown.title")}
      </p>
      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
        {cells.map((cell) => (
          <div key={cell.label} className="card-elegant px-2 py-4 text-center">
            <div className="font-display text-2xl text-foreground sm:text-4xl">
              {String(cell.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
              {cell.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
