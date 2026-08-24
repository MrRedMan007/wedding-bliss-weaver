import jsPDF from "jspdf";
import QRCode from "qrcode";

import type { Guest, WeddingSettings } from "./wedding";

export async function makeQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    width: 512,
    margin: 1,
    color: { dark: "#5b2a33", light: "#ffffff" },
  });
}

type PdfLabels = {
  invitationFor: string;
  accompaniedBy: string;
  guestCode: string;
  scanNote: string;
  date: string;
  time: string;
  venue: string;
  address: string;
};

export async function buildInvitationPdf(
  guest: Pick<Guest, "full_name" | "spouse_name" | "accompanying_count" | "qr_code_value">,
  settings: WeddingSettings,
  labels: PdfLabels,
  formatted: { date: string; time: string },
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  doc.setFillColor(252, 248, 244);
  doc.rect(0, 0, width, height, "F");

  doc.setDrawColor(196, 160, 92);
  doc.setLineWidth(1.5);
  doc.rect(28, 28, width - 56, height - 56);
  doc.setLineWidth(0.5);
  doc.rect(38, 38, width - 76, height - 76);

  doc.setTextColor(120, 60, 70);
  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.text("Save the date", width / 2, 100, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(38);
  doc.text("Amin & Aicha", width / 2, 150, { align: "center" });

  doc.setDrawColor(196, 160, 92);
  doc.line(width / 2 - 90, 168, width / 2 + 90, 168);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(110, 95, 90);
  doc.text(labels.invitationFor.toUpperCase(), width / 2, 200, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(70, 45, 50);
  const names = guest.spouse_name
    ? `${guest.full_name} & ${guest.spouse_name}`
    : guest.full_name;
  doc.text(names, width / 2, 228, { align: "center", maxWidth: width - 140 });

  if (guest.accompanying_count > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(110, 95, 90);
    doc.text(`${labels.accompaniedBy} ${guest.accompanying_count}`, width / 2, 250, {
      align: "center",
    });
  }

  const rows: Array<[string, string]> = [
    [labels.date, formatted.date],
    [labels.time, formatted.time],
    [labels.venue, settings.venue_name],
    [labels.address, settings.venue_address],
  ];

  let y = 300;
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(150, 120, 80);
    doc.text(label.toUpperCase(), 90, y);
    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.setTextColor(70, 45, 50);
    doc.text(value, 90, y + 20, { maxWidth: width - 180 });
    y += 52;
  });

  const qr = await makeQrDataUrl(guest.qr_code_value);
  const qrSize = 150;
  doc.addImage(qr, "PNG", (width - qrSize) / 2, y + 10, qrSize, qrSize);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 95, 90);
  doc.text(labels.scanNote, width / 2, y + qrSize + 32, { align: "center" });
  doc.setFontSize(9);
  doc.text(
    `${labels.guestCode}: ${guest.qr_code_value.slice(0, 12).toUpperCase()}`,
    width / 2,
    y + qrSize + 48,
    { align: "center" },
  );

  return doc;
}
