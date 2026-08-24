import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { useI18n } from "@/i18n";
import { formatWeddingDate, type WeddingSettings } from "@/lib/wedding";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Hero({ settings }: { settings: WeddingSettings | null }) {
  const { t, locale } = useI18n();

  return (
    <header className="bg-romance relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
      <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-blush/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />

      <LanguageSwitcher className="absolute end-5 top-5" />

      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {t("hero.kicker")}
      </p>
      <h1 className="mt-6 text-5xl leading-tight text-foreground sm:text-7xl">
        {t("hero.couple")}
      </h1>
      <Heart className="animate-float-slow mt-6 h-7 w-7 text-primary" strokeWidth={1.4} />
      <div className="divider-gold my-7 max-w-xs" />
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t("hero.families")}
      </p>
      {settings ? (
        <p className="mt-6 font-display text-lg text-gold-gradient sm:text-2xl">
          {formatWeddingDate(settings, locale)}
        </p>
      ) : null}

      <Button asChild className="mt-9 h-12 px-7 text-base">
        <Link to="/form">{t("hero.cta")}</Link>
      </Button>
    </header>
  );
}
