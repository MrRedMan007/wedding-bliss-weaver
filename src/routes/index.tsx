import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAccess } from "@/lib/access";
import { useI18n } from "@/i18n";
import { weddingSettingsQuery, weddingDateTime } from "@/lib/wedding";
import { GateScreen } from "@/components/GateScreen";
import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { WeddingDetails } from "@/components/WeddingDetails";
import { Gallery } from "@/components/Gallery";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amin & Aicha — Invitation de mariage" },
      {
        name: "description",
        content:
          "Invitation privée au mariage d'Amin & Aicha : date, lieu, galerie et formulaire pour générer votre invitation avec QR code.",
      },
      { property: "og:title", content: "Amin & Aicha — Invitation de mariage" },
      {
        property: "og:description",
        content: "Rejoignez-nous pour célébrer le mariage d'Amin & Aicha.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { ready, code } = useAccess();
  const { t } = useI18n();
  const { data: settings, isLoading } = useQuery(weddingSettingsQuery);

  if (!ready) {
    return <div className="bg-romance min-h-screen" />;
  }

  if (!code) return <GateScreen />;

  return (
    <div className="min-h-screen">
      <Hero settings={settings ?? null} />
      <section className="mx-auto w-full max-w-3xl px-5 py-16">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : settings ? (
          <Countdown target={weddingDateTime(settings)} />
        ) : null}
      </section>
      {settings ? <WeddingDetails settings={settings} /> : null}
      <Gallery />
      <footer className="border-t border-gold/25 px-5 py-10 text-center text-sm text-muted-foreground">
        Amin &amp; Aicha — {t("hero.kicker")}
      </footer>
    </div>
  );
}
