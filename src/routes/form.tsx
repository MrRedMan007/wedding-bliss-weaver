import { createFileRoute } from "@tanstack/react-router";

import { useAccess } from "@/lib/access";
import { GateScreen } from "@/components/GateScreen";
import { GuestForm } from "@/components/GuestForm";

export const Route = createFileRoute("/form")({
  head: () => ({
    meta: [
      { title: "Votre invitation personnalisée — Amin & Aicha" },
      {
        name: "description",
        content:
          "Renseignez vos informations pour recevoir votre invitation de mariage personnalisée avec QR code.",
      },
      { property: "og:title", content: "Votre invitation personnalisée — Amin & Aicha" },
      {
        property: "og:description",
        content: "Générez votre invitation au mariage d'Amin & Aicha avec QR code.",
      },
    ],
  }),
  component: FormPage,
});

function FormPage() {
  const { ready, code } = useAccess();
  if (!ready) return <div className="bg-romance min-h-screen" />;
  if (!code) return <GateScreen />;
  return <GuestForm />;
}
