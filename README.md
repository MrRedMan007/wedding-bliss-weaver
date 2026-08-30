# Wedding Bliss Weaver

Master Prompt Lovable — Site d'Invitation de Mariage "Amin & Aicha"

Copie-colle tout le bloc ci-dessous dans Lovable pour démarrer le projet.

PROMPT

Build a full-featured wedding invitation web app called "Amin & Aicha Wedding" using React, TypeScript, Tailwind CSS, and Supabase as the backend. Design direction: romantic/floral — soft pastel palette (blush pink, cream, sage green, gold accents), elegant serif headings (e.g. Playfair Display) paired with a clean sans-serif body font, subtle floral/botanical SVG or line-art decorations framing sections, gentle fade/slide-in animations on scroll. Fully responsive, mobile-first.

1. Languages & RTL

Implement a language switcher supporting Arabic (RTL), French, and English. Use dir="rtl" dynamically when Arabic is selected, mirroring layout, paddings, and icons correctly. Store all UI strings in a simple i18n JSON structure (one file per language) so text is easy to edit later. Default language: French.

2. Access Gate (Invitation Code)

Before any invitation content is shown, display a centered, elegant gate screen asking the guest to enter an "Invitation Code". Validate the code against a Supabase table invitation_codes (fields: id, code, is_used boolean, guest_label optional text, created_at). If the code is valid, grant access to the site for that session (store in sessionStorage/localStorage plus a Supabase session flag). If invalid, show a friendly error message in the active language. Include a simple admin-managed way to generate/list codes later via the admin dashboard.

3. Landing / Invitation Template Page

After the gate, show the main invitation page with:

Hero section: "Amin & Aicha" as the short couple name in an elegant script/serif treatment, with a subtitle mentioning both families (e.g. "Familles Chebbi & Hmidi ont l'honneur de vous inviter à célébrer le mariage de leurs enfants" — adapt per language).
Countdown timer to the wedding date/time (pulled from the wedding_settings table described below — must NOT be hardcoded).
Wedding details section: date, time, and venue/location, all editable via admin.
An embedded Google Maps section showing the venue location (use an iframe embed with a placeholder query string tied to the venue name/coordinates from wedding_settings).
Photo gallery section: a responsive grid/carousel of engagement or couple photos, images stored in Supabase Storage, manageable later via admin.
A prominent "Remplir le formulaire" / "Fill the form" call-to-action button leading to the RSVP-less invitation form.
4. Guest Information Form

Build a flexible multi-field form that adapts based on guest type:

Guest gender: Homme / Femme (radio or toggle).
Marital status: Marié(e) / Célibataire (radio or toggle).
If "Marié(e)" is selected, show an additional optional field for the spouse's name (so the invitation can be addressed to both spouses).
Full name (required).
Phone number (required, with basic format validation).
Email address (required, with format validation).
Number of accompanying guests: numeric stepper/select, capped between 0 and 4.
No RSVP yes/no field — this form is purely for generating the personalized invitation, not confirming attendance.
On submit, save the entry to a Supabase table guests (fields: id, full_name, spouse_name nullable, gender, marital_status, phone, email, accompanying_count, qr_code_value unique, invitation_code_used nullable, created_at).
Generate a unique code/value per guest (e.g. UUID or short unique string) to be encoded into a QR code on their PDF, used later for entry control at the venue.
5. Printable PDF Invitation Generation

After successful form submission, generate a downloadable, printable PDF invitation client-side (use a library like jspdf combined with html2canvas, or @react-pdf/renderer — choose whichever integrates most cleanly in Lovable) that includes:

The romantic/floral design matching the site's visual identity.
"Amin & Aicha" as the couple name header, plus the both-families invitation wording, localized to the guest's selected language.
The guest's full name (and spouse's name if provided, formatted naturally e.g. "M. & Mme [Name] & [Spouse Name]" or the equivalent per language/gender).
Wedding date, time, and venue (from wedding_settings).
The unique QR code (generate via a QR library such as qrcode or qrcode.react, encoding the guest's unique code) placed elegantly in a corner of the invitation.
A "Download PDF" button and a "Share via WhatsApp" button. The WhatsApp share button should open https://wa.me/?text=... with a short message plus a link/attachment reference to the generated PDF (or trigger the native share sheet via the Web Share API on supported devices, falling back to the wa.me link).
6. Admin Dashboard

Build a separate /admin route protected by its own Supabase Auth (email/password login, NOT the guest invitation code). Once logged in, the admin can:

View a searchable, filterable, sortable table of all guests who submitted the form (name, spouse name, gender, marital status, phone, email, accompanying count, submission date).
Export the guest list as CSV.
Manage wedding_settings (a single-row Supabase table with fields: wedding_date, wedding_time, venue_name, venue_address, venue_lat, venue_lng) through a simple settings form — this is what powers the countdown, details section, and Google Maps embed on the public site.
Manage the photo gallery: upload/delete images stored in Supabase Storage, reorder them.
Generate and manage invitation codes (create new codes, mark as used/unused, view which guest used which code).
7. Technical Requirements
React + TypeScript + Tailwind CSS, component-based architecture.
Supabase for: Auth (admin only), Postgres tables (guests, wedding_settings, invitation_codes), and Storage (gallery photos).
Set up Row Level Security so public/anon users can only insert into guests and read wedding_settings + validate invitation_codes, while all admin operations require authenticated admin role.
Clean, reusable component structure: GateScreen, Hero, Countdown, WeddingDetails, MapEmbed, Gallery, GuestForm, InvitationPDFPreview, AdminLayout, AdminGuestsTable, AdminSettingsForm, AdminGalleryManager, AdminCodesManager.
Language switcher persists selection (localStorage) and applies RTL/LTR + font direction site-wide.
Fully responsive across mobile, tablet, and desktop, with special attention to the mobile experience since most guests will open this on their phone.
Elegant loading and error states throughout (form submission, PDF generation, admin data fetches).

Build this as a polished, production-ready MVP covering everything above.

Note perso (pas dans le prompt Lovable) : une fois le projet généré, tu devras ajouter tes vraies infos dans wedding_settings (date, heure, lieu) et uploader vos photos depuis le dashboard admin.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6dd0cb60-c2df-4d5b-a836-5dc0b21fd957).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
