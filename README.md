# UK Tick Tracker

**Elanco Placement Programme: Technical Task (Frontend)**
Built by **Miyelangelo Dell'Ovo Mujica**, BSc Computer Science (AI), Brunel University London

An interactive web app that maps reported tick sightings across the UK, helps people identify tick species and avoid bites, and lets them report their own sightings.

📹 **Video walkthrough:** https://www.youtube.com/watch?v=lj2wwAMLMPk

---

## Contents
1. [What it does](#what-it-does)
2. [How to run it](#how-to-run-it)
3. [How the brief's requirements are covered](#how-the-briefs-requirements-are-covered)
4. [Tech stack and why](#tech-stack-and-why)
5. [Key design decisions](#key-design-decisions)
6. [Accessibility](#accessibility)
7. [Project structure](#project-structure)
8. [Testing](#testing)
9. [Limitations and what I'd do next](#limitations-and-what-id-do-next)
10. [Use of AI](#use-of-ai)
11. [Credits](#credits)

---

## What it does

The app has three tabs:

- **Map**: every UK city with sightings is shown as a circle. The **size** shows how many sightings it has and the **colour** shows its activity level (high / medium / low). You can filter by **species** and **year**. Clicking a circle opens a popup with the city's details and quick actions (**Get directions**, **Share**, **Report a sighting**). A **Results** panel beside the map lists the newest matching sightings, and hovering one opens that city on the map.
- **Learn about ticks**: a species identification guide for the 5 species in the data, prevention tips for people and pets, and what to do if you find a tick. Facts come from the UK Health Security Agency and the NHS, with links.
- **Report a sighting**: a form (date, time, location, species, optional photo) with error, warning and success messages. Saved reports appear on the map straight away.

The toolbar (top right) has **light/dark mode**, a **colour-blind-friendly** palette and a **larger text** toggle. All three are remembered between visits.

---

## How to run it

**You'll need:** [Node.js](https://nodejs.org) (LTS version; I developed with v24) and Git.

```bash
# 1. Download the code
git clone https://github.com/Miyelangelo17/tick-tracker.git
cd tick-tracker

# 2. Install the libraries the project uses
npm install

# 3. Start the app
npm run dev 

then click on O + enter in the terminal to run it on a browser 

Type Q + enter to exit in terminal
```

Then open the address it prints, normally **http://localhost:5173**. It most likely opens the tab for you  though

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Builds an optimised version for hosting (into `dist/`) |
| `npm run preview` | Serves that built version locally |

> **Windows tip:** if PowerShell says "running scripts is disabled", use Command Prompt instead. I used Command Prompt

No API key is needed. The sightings come from Elanco's public API (`https://dev-task.elancoapps.com/data/tick-sightings`).

---

## How the brief's requirements are covered

The brief asks for at least 2 features from each area.

| Area | Requirement | Status | How |
|---|---|---|---|
| **1. Interactive map** | Dynamic map of UK sightings | ✓ | Leaflet map, limited to the UK |
| | Markers with visual indicators | ✓ | Circle **size** = number of sightings, **colour** = activity level, plus a legend |
| | Filter controls | ✓ | Species and year dropdowns (they work together) |
| **2. Sighting information** | Sidebar/modal on click | ✓ | Popup with total, activity level and 5 most recent sightings, plus the Results panel |
| | Quick actions | ✓ | Report a sighting (pre-fills the city), Get directions (Google Maps), Share |
| **3. Education** | Species identification guide | ✓ | 5 species cards with Latin names, hosts, habitat, tips and "Read more" links |
| | Prevention tips | ✓ | Prevention for people and pets, tick removal steps, when to see a GP |
| **4. Report a sighting** | Form | ✓ | Date, time, location, species, photo. Saved locally (see [decisions](#key-design-decisions)) |
| | Validation messages | ✓ | **Errors** (block saving), **warning** (no photo), **success** |
| | Image upload | ✓ | Type and size checks (images only, max 5 MB) with a preview |
| **Extras** | Accessibility | ✓ | See [Accessibility](#accessibility) |

---

## Tech stack and why

| Tool | Why I chose it |
|---|---|
| **React** | Component-based, so each part (map, results, guide, form) is its own file. I'd used it before, so I could focus on features rather than learning a new framework. |
| **Vite** | Fast development server that updates the page as soon as I save. |
| **Leaflet + react-leaflet** | Free, popular and well-documented map library, and needs **no API key**. react-leaflet lets me use it as React components. |
| **OpenStreetMap tiles** | Free map images that need no key. |
| **Plain CSS** (with CSS variables) | The app is small, so a CSS framework would add setup without much benefit. Variables make the light/dark theme and colour palettes easy to switch. |
| **localStorage** | Stores the user's reports and settings in the browser with no server needed (trade-offs below). |
| **ESLint** | Catches mistakes and keeps the code consistent. |

---

## Key design decisions

**The API has no coordinates, so I added a lookup table.** Each sighting only has a city name. `src/cities.js` maps each of the 14 cities to its latitude and longitude. Any sighting from a city not in the table is skipped, so bad data can't break the map.

**One circle per city instead of one per sighting.** With no exact locations, 1,000 markers would sit on top of each other on 14 points. Grouping by city and sizing circles by count shows the pattern far more clearly.

**I worked out "severity" myself.** The API has no severity field, so a city's activity level compares its count with the busiest city: 85%+ is **High**, 70%+ is **Medium**, anything else is **Low**. Because it's relative, the colours still make sense when the data is filtered. The rule lives in one file (`src/severity.js`), shared by the map, Results panel and legend.

**Filter by species and year rather than a date range.** These are simpler for users, and year matches how the data is spread (2012–2024).

**"Recent" means within a year of the newest sighting in the data.** The API data stops in 2024, so comparing with today's date would mark nothing as recent.

**localStorage instead of a real database.** The brief hints that reports need their own database. For this MVP I used the browser's localStorage: it needs no server, works offline, and keeps the project simple to run. **The trade-off:** reports only exist in the browser they were made in, so other users can't see them. In production I'd use a hosted database such as Supabase or Firebase, with moderation before reports go public. Reports are saved in the same shape as the API's sightings, so the map, filters and guide include them with no extra code.

**Only the photo's file name is saved, not the image.** localStorage holds only about 5 MB. In production, photos would go to cloud storage.

**Tabs are React state, not a routing library.** With three pages, a router (e.g. React Router) would add complexity for no real benefit.

**App owns the data; components display it.** `App.jsx` fetches, filters and saves; `TickMap`, `Results` and `Learn` just draw what they're given. Child components tell App about events (e.g. "report this city") by calling functions App passes down.

**Elanco's brand colours, but not their logo.** I sampled Elanco's blues from elanco.com so the tracker feels like part of their products, but used my own logo, since using a company's logo on a public repo could make it look official. Severity colours stay red/orange/yellow because warm colours read as "danger" instantly.

**Place names stay readable under the circles.** I first tried map tiles with a separate labels layer, but that service now requires an API key and the map broke. I switched back to OpenStreetMap and used CSS `mix-blend-mode: multiply`, so the circles act like see-through coloured film.

---

## Accessibility

- **Colour-blind-friendly toggle**: switches to the "viridis" palette (purple / teal / yellow), which people with any type of colour blindness can tell apart, because the levels also differ in brightness.
- **Larger text toggle**: every font size is `size × --scale`, so one switch enlarges all text by 25% without breaking the map.
- **Readable font**: Atkinson Hyperlegible, designed by the Braille Institute for people with low vision.
- **Contrast checked**: e.g. white on Elanco blue is about 5.3:1 (minimum 4.5:1). In dark mode, text uses lighter blue and red so it stays readable.
- **Screen readers**: form labels are linked to their inputs; required fields use `required`; error and success messages are announced (`role="alert"` / `role="status"`); toggles use `aria-pressed`; icon buttons have `aria-label`s; decorative images use `alt=""`; new-tab links say so.
- **Keyboard**: tabs, filters, toolbar, form and Results cards all work with the keyboard, with visible focus rings. Focusing a Results card opens that city's popup, which gives keyboard users a way into the map.
- **Reduced motion**: animations switch off for users who've asked their computer for less motion.
- **Phones**: the layout adapts below 600px wide (stacked results, wrapping filters, toolbar in a row).

---

## Project structure

```
tick-tracker/
├── public/
│   ├── favicon.png           Browser tab icon (my logo)
│   └── icons/                Toolbar icons (Lucide)
├── src/
│   ├── main.jsx              Starting point: puts <App /> on the page
│   ├── App.jsx               Fetches data, holds state, filters, tabs, toolbar
│   ├── index.css             All styles: colours, layout, dark mode, phone layout
│   ├── cities.js             City name → latitude/longitude lookup
│   ├── severity.js           Activity-level rule and colour palettes
│   ├── assets/tick-logo.png  My logo
│   └── Components/
│       ├── TickMap.jsx       Map, circles, popups and quick actions
│       ├── Results.jsx       Newest-sightings panel beside the map
│       ├── Learn.jsx         Species guide and prevention tips
│       └── ReportForm.jsx    Report form with validation and photo upload
├── NOTES.md                  My development log: decisions and problems solved
└── README.md
```

---

## Testing

I tested manually in the browser (Opera GX / Chromium) after each change:
- Filters (species, year, and both together), popups, quick actions and the Results hover link.
- The report form: empty submission, a future date, a non-image file, a valid report with and without a photo, and reports surviving a page refresh.
- Light/dark mode, the colour-blind palette and larger text, including that they're remembered after a refresh.
- Phone-sized screens using the browser's device toolbar.
- `npm run lint` and `npm run build` both pass with no errors.

Automated tests (Vitest + React Testing Library) are on my next-steps list.

---

## Limitations and what I'd do next

- **Shared database** (Supabase/Firebase) so reports are visible to everyone, with moderation and photo storage.
- **Timeline view** of activity in each city, and the **seasonal activity chart** (city + year dropdowns), probably with Recharts, which I've used before.
- **Severity filter** to show only high-activity areas.
- **Exact locations**: report by postcode or GPS instead of choosing a city, then cluster nearby markers.
- **Automated tests** and a **hosted version** (e.g. Vercel) so reviewers can open it without installing anything.
- **Dark map tiles** for dark mode (OpenStreetMap only offers one style; most dark styles need an API key).

---

## Use of AI

I want to be open about how I used AI, as I would on a real team.

-  **Claude (Anthropic)** was my main assistant. At the start it taught me step by step while I wrote the first parts myself (fetching the data, the base map, counting sightings per city), explaining each line and helping me debug. From the map circles onwards I was short on time, so Claude wrote much of the feature and styling code from my instructions. I tested every change in the browser, asked for fixes when things weren't right, and went through the code so I understand how each part works.
- **GitHub Copilot** autocomplete in VS Code suggested some code, mostly CSS styling, and the map boundary coordinates, which I checked by dragging the map to each edge.
- **Logo:** I drafted it with Google Gemini, then finished it in LogoMakr and Photoshop. It's used for the header logo and the browser tab icon.

All design decisions, feature choices and trade-offs are mine. My `NOTES.md` dev log records what I did, what went wrong and what I learned in each session.

---

## Credits

- **Tick sighting data:** Elanco tick sightings API
- **Map:** [Leaflet](https://leafletjs.com) · map tiles © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Species facts:** [UK Health Security Agency, tick species profiles](https://www.gov.uk/guidance/tick-species-profiles)
- **Tick bite advice:** [NHS](https://www.nhs.uk/conditions/lyme-disease/)
- **Icons:** [Lucide](https://lucide.dev) (ISC licence)
- **Font:** [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) (SIL Open Font Licence)
- **Colour-blind palette:** viridis
