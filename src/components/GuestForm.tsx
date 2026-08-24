import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";
import {
  formatWeddingDate,
  formatWeddingTime,
  weddingSettingsQuery,
  type WeddingSettings,
} from "@/lib/wedding";
import { useAccess } from "@/lib/access";
import { buildInvitationPdf, makeQrDataUrl } from "@/lib/invitation-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type Submitted = {
  full_name: string;
  spouse_name: string | null;
  accompanying_count: number;
  qr_code_value: string;
};

export function GuestForm() {
  const { t, lang, locale } = useI18n();
  const { code } = useAccess();
  const { data: settings } = useQuery(weddingSettingsQuery);

  const [gender, setGender] = useState("female");
  const [maritalStatus, setMaritalStatus] = useState("single");
  const [fullName, setFullName] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accompanying, setAccompanying] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const schema = z.object({
    full_name: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(6).max(30),
    email: z.string().trim().email().max(255),
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse({ full_name: fullName, phone, email });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        next[key] = t(
          key === "full_name"
            ? "form.errors.fullName"
            : key === "phone"
              ? "form.errors.phone"
              : "form.errors.email",
        );
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const qrValue = crypto.randomUUID().replace(/-/g, "");
    const spouse = maritalStatus === "married" && spouseName.trim() ? spouseName.trim() : null;

    const { error } = await supabase.from("guests").insert({
      full_name: parsed.data.full_name,
      spouse_name: spouse,
      gender,
      marital_status: maritalStatus,
      phone: parsed.data.phone,
      email: parsed.data.email,
      accompanying_count: accompanying,
      qr_code_value: qrValue,
      invitation_code_used: code,
      language: lang,
    });
    setSubmitting(false);

    if (error) {
      toast.error(t("form.errors.generic"));
      return;
    }

    const guest: Submitted = {
      full_name: parsed.data.full_name,
      spouse_name: spouse,
      accompanying_count: accompanying,
      qr_code_value: qrValue,
    };
    setSubmitted(guest);
    setQrUrl(await makeQrDataUrl(qrValue));
  }

  async function downloadPdf(guest: Submitted, weddingSettings: WeddingSettings) {
    setPdfLoading(true);
    try {
      const doc = await buildInvitationPdf(
        guest,
        weddingSettings,
        {
          invitationFor: t("pdf.invitationFor"),
          accompaniedBy: t("pdf.accompaniedBy"),
          guestCode: t("pdf.guestCode"),
          scanNote: t("pdf.scanNote"),
          date: t("details.date"),
          time: t("details.time"),
          venue: t("details.venue"),
          address: t("details.address"),
        },
        {
          date: formatWeddingDate(weddingSettings, locale),
          time: formatWeddingTime(weddingSettings, locale),
        },
      );
      doc.save(`invitation-${guest.full_name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="bg-romance min-h-screen px-5 py-16">
        <LanguageSwitcher className="mx-auto mb-8 flex w-fit" />
        <div className="card-elegant mx-auto max-w-lg px-6 py-10 text-center">
          <h1 className="text-3xl text-foreground">{t("pdf.ready")}</h1>
          <div className="divider-gold my-6" />
          <p className="text-sm text-muted-foreground">{t("pdf.readyText")}</p>
          {qrUrl ? (
            <img
              src={qrUrl}
              alt={t("pdf.scanNote")}
              className="mx-auto mt-7 h-44 w-44 rounded-xl border border-gold/40 bg-white p-2"
            />
          ) : null}
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            {t("pdf.guestCode")}: {submitted.qr_code_value.slice(0, 12).toUpperCase()}
          </p>

          <div className="mt-8 space-y-3">
            <Button
              className="h-12 w-full"
              disabled={pdfLoading || !settings}
              onClick={() => settings && downloadPdf(submitted, settings)}
            >
              {pdfLoading ? t("pdf.generating") : t("pdf.download")}
            </Button>
            <Button asChild variant="outline" className="h-12 w-full">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(t("pdf.shareText"))}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("pdf.share")}
              </a>
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setSubmitted(null)}>
              {t("pdf.newInvitation")}
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">{t("form.back")}</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-romance min-h-screen px-5 py-16">
      <LanguageSwitcher className="mx-auto mb-8 flex w-fit" />
      <div className="card-elegant mx-auto max-w-lg px-6 py-9">
        <h1 className="text-center text-3xl text-foreground">{t("form.title")}</h1>
        <div className="divider-gold my-5" />
        <p className="text-center text-sm text-muted-foreground">{t("form.subtitle")}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("form.gender")}</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("form.male")}</SelectItem>
                  <SelectItem value="female">{t("form.female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("form.maritalStatus")}</Label>
              <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">{t("form.single")}</SelectItem>
                  <SelectItem value="married">{t("form.married")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">{t("form.fullName")}</Label>
            <Input
              id="fullName"
              value={fullName}
              maxLength={120}
              onChange={(event) => setFullName(event.target.value)}
              placeholder={t("form.fullNamePlaceholder")}
            />
            {errors["full_name"] ? (
              <p className="text-sm text-destructive">{errors["full_name"]}</p>
            ) : null}
          </div>

          {maritalStatus === "married" ? (
            <div className="space-y-2">
              <Label htmlFor="spouseName">{t("form.spouseName")}</Label>
              <Input
                id="spouseName"
                value={spouseName}
                maxLength={120}
                onChange={(event) => setSpouseName(event.target.value)}
                placeholder={t("form.spousePlaceholder")}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="phone">{t("form.phone")}</Label>
            <Input
              id="phone"
              value={phone}
              maxLength={30}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t("form.phonePlaceholder")}
            />
            {errors["phone"] ? (
              <p className="text-sm text-destructive">{errors["phone"]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("form.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              maxLength={255}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("form.emailPlaceholder")}
            />
            {errors["email"] ? (
              <p className="text-sm text-destructive">{errors["email"]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accompanying">{t("form.accompanying")}</Label>
            <Input
              id="accompanying"
              type="number"
              min={0}
              max={20}
              value={accompanying}
              onChange={(event) =>
                setAccompanying(Math.min(20, Math.max(0, Number(event.target.value) || 0)))
              }
            />
          </div>

          <Button type="submit" disabled={submitting} className="h-12 w-full text-base">
            {submitting ? t("form.submitting") : t("form.submit")}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/">{t("form.back")}</Link>
          </Button>
        </form>
      </div>
    </main>
  );
}
