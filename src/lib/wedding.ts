import { supabase } from "@/integrations/supabase/client";

export type WeddingSettings = {
  id: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  venue_lat: number | null;
  venue_lng: number | null;
};

export type Guest = {
  id: string;
  full_name: string;
  spouse_name: string | null;
  gender: string;
  marital_status: string;
  phone: string;
  email: string;
  accompanying_count: number;
  qr_code_value: string;
  invitation_code_used: string | null;
  language: string;
  created_at: string;
};

export type GalleryPhoto = {
  id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
};

export type InvitationCode = {
  id: string;
  code: string;
  is_used: boolean;
  guest_label: string | null;
  created_at: string;
};

export const weddingSettingsQuery = {
  queryKey: ["wedding-settings"],
  queryFn: async (): Promise<WeddingSettings | null> => {
    const { data, error } = await supabase
      .from("wedding_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as WeddingSettings | null;
  },
};

export async function fetchGallery(): Promise<Array<GalleryPhoto & { url: string }>> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const photos = (data ?? []) as GalleryPhoto[];
  if (photos.length === 0) return [];
  const { data: signed } = await supabase.storage
    .from("gallery")
    .createSignedUrls(
      photos.map((p) => p.storage_path),
      60 * 60 * 24,
    );
  return photos.map((photo, index) => ({
    ...photo,
    url: signed?.[index]?.signedUrl ?? "",
  }));
}

export const galleryQuery = {
  queryKey: ["gallery"],
  queryFn: fetchGallery,
};

export function weddingDateTime(settings: WeddingSettings): Date {
  return new Date(`${settings.wedding_date}T${settings.wedding_time}`);
}

export function formatWeddingDate(settings: WeddingSettings, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${settings.wedding_date}T00:00:00`));
}

export function formatWeddingTime(settings: WeddingSettings, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
    new Date(`${settings.wedding_date}T${settings.wedding_time}`),
  );
}

export function mapsQuery(settings: WeddingSettings): string {
  if (settings.venue_lat != null && settings.venue_lng != null) {
    return `${settings.venue_lat},${settings.venue_lng}`;
  }
  return `${settings.venue_name} ${settings.venue_address}`;
}
