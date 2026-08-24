import { LANGUAGES, useI18n, type Language } from "@/i18n";
import { cn } from "@/lib/utils";

const LABELS: Record<Language, string> = { fr: "FR", en: "EN", ar: "ع" };

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-gold/40 bg-card/70 p-1 backdrop-blur",
        className,
      )}
    >
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "min-w-9 rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors",
            lang === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}
