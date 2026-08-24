import { CalendarDays, Clock, MapPin } from "lucide-react";

import { useI18n } from "@/i18n";
import {
  formatWeddingDate,
  formatWeddingTime,
  mapsQuery,
  type WeddingSettings,
} from "@/lib/wedding";
import { Button } from "@/components/ui/button";

export function WeddingDetails({ settings }: { settings: WeddingSettings }) {
  const { t, locale } = useI18n();
  const query = encodeURIComponent(mapsQuery(settings));

  const rows = [
    { icon: CalendarDays, label: t("details.date"), value: formatWeddingDate(settings, locale) },
    { icon: Clock, label: t("details.time"), value: formatWeddingTime(settings, locale) },
    { icon: MapPin, label: t("details.venue"), value: settings.venue_name },
    { icon: MapPin, label: t("details.address"), value: settings.venue_address },
  ];

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-16">
      <h2 className="text-center text-3xl text-foreground">{t("details.title")}</h2>
      <div className="divider-gold my-8" />

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="card-elegant flex items-start gap-3 px-5 py-4">
            <row.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.6} />
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {row.label}
              </div>
              <div className="mt-1 text-base text-foreground">{row.value}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-12 text-center text-2xl text-foreground">{t("details.mapTitle")}</h3>
      <div className="mt-5 overflow-hidden rounded-2xl border border-gold/30 shadow-soft">
        <iframe
          title={t("details.mapTitle")}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          className="h-72 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-4 text-center">
        <Button asChild variant="outline">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noreferrer"
          >
            {t("details.openMaps")}
          </a>
        </Button>
      </div>
    </section>
  );
}
