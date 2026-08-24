import { useState } from "react";
import { Heart } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";
import { useAccess } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function GateScreen() {
  const { t } = useI18n();
  const { grant } = useAccess();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = code.trim();
    if (!value) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc("check_invitation_code", {
        _code: value,
      });
      if (rpcError) throw rpcError;
      if (data === true) {
        grant(value.toUpperCase());
      } else {
        setError(t("gate.invalid"));
      }
    } catch {
      setError(t("gate.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-romance relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-blush/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />

      <LanguageSwitcher className="absolute end-5 top-5" />

      <div className="card-elegant relative w-full max-w-md px-7 py-10 text-center">
        <Heart className="animate-float-slow mx-auto h-8 w-8 text-primary" strokeWidth={1.4} />
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Amin &amp; Aicha
        </p>
        <h1 className="mt-3 text-3xl text-foreground">{t("gate.title")}</h1>
        <div className="divider-gold my-5" />
        <p className="text-sm text-muted-foreground">{t("gate.subtitle")}</p>

        <form onSubmit={onSubmit} className="mt-7 space-y-3">
          <Input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={t("gate.placeholder")}
            maxLength={40}
            autoComplete="off"
            className="h-12 text-center text-base tracking-[0.2em] uppercase"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={loading} className="h-12 w-full text-base">
            {loading ? t("gate.checking") : t("gate.submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}
