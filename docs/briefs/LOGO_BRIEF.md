# inField — Logo Design Brief

## About the Product

- **App Name:** inField (the "i" is lowercase, the "F" is uppercase)
- **Category:** Construction inspection management (SaaS)
- **Target Market:** Israel (Hebrew, RTL interface)
- **Users:** Construction inspectors, engineers, project managers
- **Two Modes:** בדק בית (defect inspection) | פרוטוקול מסירה (delivery checklist)
- **Key Differentiator:** Native mobile feel (not WebView), full offline support
- **Main Competitor:** Reporto (~80% market share)

---

## Required Deliverables

### Primary Files (must have)

| File | Size | Format | Notes |
|---|---|---|---|
| `icon.png` | 1024×1024 px | PNG, **no transparency** | iOS App Store icon. Do NOT round corners — iOS adds them automatically |
| `adaptive-icon.png` | 1024×1024 px | PNG, **with transparency** | Android foreground layer. Logo must sit within the **central 66%** (safe zone) |
| `splash-icon.png` | 288×288 px | PNG, with transparency | Splash screen icon, displayed on cream background (`#FEFDFB`) |
| `favicon.png` | 48×48 px | PNG | Browser tab icon (web version) |
| Source file | Vector | SVG or Adobe Illustrator (.ai) | Editable master file for future use |

### Optional — App Store Marketing

| File | Size | Notes |
|---|---|---|
| Feature Graphic (Google Play) | 1024×500 px | Banner with logo + app name |
| Social sharing image | 1200×630 px | For social media / link previews |

### Variations Needed

1. **Icon only** — standalone symbol (for app icon, favicon)
2. **Icon + wordmark** — symbol + "inField" text (for splash screen, marketing, website)

---

## Color Palette

The app has an established design system. The logo must use these colors:

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary | Forest Green | `#1B7A44` | Main brand color |
| Dark Green | Deep Forest | `#0F4F2E` | Android icon background, dark accents |
| Light Green | Mint | `#F0F7F4` | Light backgrounds |
| Accent | Burnished Gold | `#C8952E` | Accent / highlight (optional in logo) |
| Background | Warm Cream | `#FEFDFB` | App background — splash screen uses this |
| White | White | `#FFFFFF` | Icon elements on dark backgrounds |

### Color Combinations the Logo Must Work On

- White elements on dark green (`#0F4F2E`) background — Android adaptive icon
- Dark green elements on cream (`#FEFDFB`) background — splash screen, in-app
- Dark green elements on white (`#FFFFFF`) background — web, documents, PDFs
- Single color (monochrome) — for stamps, fax, B&W printing

---

## Typography

| Language | Font | Weights Used |
|---|---|---|
| Hebrew | **Rubik** (Google Fonts) | Regular 400, Medium 500, SemiBold 600, Bold 700 |
| English & Numbers | **Inter** (Google Fonts) | Regular 400, Medium 500, Bold 700 |

The wordmark "inField" should use **Inter** (it's an English word).

---

## Android Adaptive Icon — Safe Zone (Critical)

Android crops the foreground image into various shapes (circle, squircle, rounded square, teardrop). The logo must be placed within the **central 66%** of the 1024×1024 canvas:

```
1024px × 1024px canvas
┌─────────────────────────────┐
│         170px padding       │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │     SAFE ZONE       │   │
│   │     684 × 684 px    │   │
│   │                     │   │
│   │   (logo goes here)  │   │
│   │                     │   │
│   └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```

Everything outside the safe zone **will be cropped** on some Android devices.

---

## iOS Icon — No Rounded Corners

iOS automatically applies a superellipse mask (~22.37% corner radius) to all app icons. **Do not add rounded corners to the icon file** — it will result in a double-round effect.

Export as a full square (1024×1024) with sharp corners.

---

## app.json Configuration (for reference)

These are the current settings in the app. The designer does not need to change these, but should know where each file is used:

```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash-icon.png",
    "backgroundColor": "#FEFDFB"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#0F4F2E"
    }
  },
  "web": {
    "favicon": "./assets/favicon.png"
  }
}
```

---

## Creative Concept — Boot Print × Fingerprint

### Core Idea

The logo is a **work boot sole print** — like a footprint left on a dusty construction site floor. It represents the inspector physically being **in the field**, walking the site, doing the work.

Inside the sole, instead of the typical tread pattern, the texture is made of **fingerprint ridges** — the concentric curved lines of a human fingerprint. This creates a visual double meaning:

- **Boot print** = field work, construction, being on-site
- **Fingerprint** = identification, inspection, personal mark, precision

Together: "an inspector's personal mark on every site they walk."

### Shape & Composition

**Boot sole outline:**
- Realistic proportions of a work boot sole (wider at the ball of the foot, narrower heel, rounded toe)
- Clean and precise vector shape — not rough/grungy, not sketch-style
- Anatomically accurate but graphically simplified (no excessive detail)

**Angle & direction:**
- The print is rotated slightly to the right (~15-20 degrees clockwise)
- Toe pointing upper-right — as if the person is walking forward / heading somewhere
- Creates dynamic energy — not static, not flat

**Fingerprint texture inside:**
- The entire interior of the sole is filled with fingerprint-style ridge lines
- Lines follow the natural flow of a real fingerprint (loops, whorls, arches)
- Spacing should be balanced: detailed enough to read as a fingerprint, but not so dense that it becomes muddy at small sizes
- At 48px (favicon) the texture can simplify or disappear — the sole silhouette alone should still be recognizable

### Wordmark

**Text:** "inField" placed below the boot print symbol.

**Font:** Inter (as per the app's design system for English text).

**Letter treatment — primary version:**
- "in" in one color + "Field" starting with "F" in a contrasting color
- Example: "in" in forest green (`#1B7A44`), "F" in dark/black (`#1a1a1a`) or white (on dark backgrounds)

**Color variations to explore:**
- "in" green + "F" black + "ield" green
- "in" light/thin + "Field" bold (weight contrast instead of color)
- "in" green + "Field" entirely in a second color
- "in" small caps or lighter weight, "Field" prominent
- Gold accent (`#C8952E`) on the "F" only

The designer should present **3-4 wordmark variations** so we can choose the one that works best.

### Style & Tone

The logo should feel like it belongs on a **professional field tool** — something an engineer would trust. Explore both directions:

1. **Solid & confident** — heavier lines, bold presence, feels like a stamp of authority
2. **Clean & modern** — lighter lines, more white space, feels like a tech product

Present at least **one version of each direction** so we can decide which fits better.

### Small Size Behavior

At small sizes (favicon 48px, tab bar 22px), the fingerprint detail inside the boot print may not be visible. This is acceptable — the **boot sole silhouette alone** must work as a recognizable icon. The fingerprint texture is a bonus at larger sizes (app icon 1024px, splash screen, marketing materials).

---

### Must

- Readable at **48px** (favicon) and at **1024px** (App Store)
- Pass **WCAG AA** contrast ratio (minimum 4.5:1)
- Feel professional and trustworthy — this produces **legal documents**
- Look like a **field tool for construction professionals**, not a banking or healthcare app

### Should

- The boot print silhouette should be instantly recognizable even without the fingerprint detail
- Feel modern and clean — not corporate or generic
- Work well as a small icon on a phone home screen among dozens of other apps
- The fingerprint texture should feel natural, not forced or overly geometric

### Avoid

- Overly complex fingerprint detail that becomes noise at small sizes
- Grungy / distressed / splatter effects — the print is clean and graphic
- Generic clipboard/checklist icons — the boot print concept replaces those
- Pure gray or cold blue tones — the brand is warm green + cream
- Gradients that don't reproduce well in print
- Making the boot print look like a hiking/outdoor shoe — it should feel like a **construction work boot**

---

## Current Placeholder (for reference)

The current icon is a temporary placeholder: white "iF" letters on a dark green (`#0F4F2E`) rounded square. This is **not** the final design — it will be replaced by the boot print concept described above.

---

## Accessibility

- The logo must be distinguishable by color-blind users (avoid relying solely on red/green differentiation)
- Minimum contrast ratio 4.5:1 between logo elements and background
- The icon should have a recognizable silhouette even without color (shape matters)
