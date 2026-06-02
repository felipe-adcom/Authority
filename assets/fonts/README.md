# Fonts — AUTHORITY

## In use (production)

- **NewBlack-Medium.ttf** — `NewBlack Typeface Medium`
  Primary brand display face. Used for headings, the AUTHORITY wordmark, kickers,
  big metric numbers and labels. Full Latin + Spanish accents + complete digit set.

## Companion (loaded from the web, with system fallback)

- **Inter** — neutral grotesque used for body copy, UI and form fields, for
  executive legibility. Loaded via `<link>` with a robust system-font fallback
  stack so the page never depends on it.

## Kept but NOT used

- **Nekst-SemiBold.otf** — `FSP DEMO - Nekst SemiBold`
  This is a **Fontspring DEMO** build. It injects a "DEMO" watermark glyph in
  place of several characters — confirmed to corrupt the digit `4`, `+`, `-`,
  `%`, `·` and other punctuation, and it lacks Spanish accents (á é í ó ú ñ ¿ ¡).
  Because those are exactly the glyphs our key metrics need (160.000+, 243x,
  37M+, CPA −25%), it is unsuitable for production and is not referenced in CSS.
  Replace this file with the **licensed full Nekst SemiBold** and it can be
  swapped into the display stack in `css/fonts.css` if desired.
