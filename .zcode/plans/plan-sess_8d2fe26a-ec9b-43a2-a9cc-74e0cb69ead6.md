## Context

Titan Global Wheel is running a **Black November** tyre promo. The campaign flyers already exist at `promo's\Black November 2026\Black November TGW 1.jpg` / `...TGW 2.jpg` (dark navy + gold + red; ~60 Goodyear/Titan tyre models listed, no prices, "Enquire Today" CTA). You want **pop-up ads + sidebar specials mentions on the website**, deliberately low-intrusion, and you'll **approve or decline the designs before anything goes live**.

This phase therefore delivers **a design preview page only** — nothing is added to any live page, no nav/sitemap changes.

## Phase A — Build the design preview (this run)

**One new file: `black-november-preview.html`** (website root, self-contained inline CSS/JS, not linked from anywhere, not in sitemap). It opens directly from file:// like the rest of the site. The page contains:

1. **A mock site backdrop** (light theme, real brand tokens from `css/site.css`: navy `#114172`, red `#e01030`, Archivo/Inter, pill buttons, real logo `src/logos/Titan Global Wheel _logo_hortizontal_2021_1.png`) so the ads are judged in context.
2. **Pop-up Variant A — "Campaign" (my recommendation):** flyer-matched HTML popup
   - Navy gradient panel, logo header + ✕ close
   - "BLACK **NOVEMBER**" Archivo 900 italic (white + gold `#f0b323`), "— TYRE SPECIALS —" letterspaced with red rules (exact flyer styling)
   - 4 featured tyres in flyer typography (gold name + brand tag + white sizes): SUPREME TFC, OPTITRAC, DYNA TORQUE II, MXL, plus "+ 60 more models on special"
   - Red **ENQUIRE TODAY** pill → `contact.html`; secondary "View the full flyer →" opens flyer JPG in a lightbox; phone line `+27 (0) 16 341 9800`
   - **Non-intrusive behavior**: appears ~2.5s after page load, **once per session** (sessionStorage), closes on ✕ / backdrop click / Escape, body scroll-lock while open, mobile = bottom-sheet slide-up with internal scroll
3. **Pop-up Variant B — "Flyer showcase":** the actual flyer JPG inside a framed modal (scaled, scrollable) + Enquire button below. Shown as the alternative.
4. **Sidebar — collapsible edge tab (my recommendation):** slim vertical "BLACK NOV 🔥" tab on the right screen edge (desktop only, hidden on mobile); expands on hover/tap into a compact card (mini BLACK NOVEMBER header, "Tyre Specials on now", 2 tyre teasers, red Enquire pill). ✕ dismiss remembers for 7 days (localStorage). Shown in **both collapsed and expanded states**. Guaranteed one-per-page by a single injector function.
5. **Controls & spec panel:** "Replay popup A / B" buttons, "Expand/collapse sidebar" toggle, plus a written behavior spec (frequency caps, triggers, responsive rules) so you approve behavior as well as looks.

Design language reused from the flyers: gold `#f0b323`, brand red `#e01030`, navy `#114172`/`#0a0d10`, Archivo display / Inter body, 999px pill buttons.

## Phase B — Integration (ONLY after your approval, separate run)

- Add `css/promo-bn.css` + `js/promo-bn.js` (self-contained, no libraries)
- Copy flyer JPGs to clean paths `src/promos/black-november-2026-{1,2}.jpg` (current folder name has an apostrophe/spaces — bad for live URLs)
- Pop-up on **index.html only** (default; adjustable if you say otherwise)
- Sidebar on main root pages (not policy/404/backup pages; blog articles left clean)
- Nothing in nav, sitemap, or chrome.js unless you ask

## Verification

- Open `black-november-preview.html` in a browser (file:// works — site is built for it), confirm: popup auto-appears after ~2.5s, dismiss via ✕/backdrop/Escape, stays dismissed within session, sidebar collapses/expands/dismisses, mobile viewport shows bottom-sheet and hides sidebar, visual match against the flyer typography/colors.
- Deliver the file link to you for **approve / decline** — no live pages touched until you approve.