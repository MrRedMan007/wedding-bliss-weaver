import { useQuery } from "@tanstack/react-query";

import { galleryQuery } from "@/lib/wedding";
import { useI18n } from "@/i18n";

export function Gallery() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery(galleryQuery);

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-16">
      <h2 className="text-center text-3xl text-foreground">{t("gallery.title")}</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">{t("gallery.subtitle")}</p>
      <div className="divider-gold my-8" />

      {isLoading ? (
        <p className="text-center text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : !data || data.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">{t("gallery.empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.map((photo) => (
            <figure
              key={photo.id}
              className="group overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-soft"
            >
              <img
                src={photo.url}
                alt={photo.caption ?? "Amin & Aicha"}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {photo.caption ? (
                <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                  {photo.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
