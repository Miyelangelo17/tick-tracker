# Development Notes — UK Tick Tracker

A short log of what I did each session, the decisions I made, and the problems I solved plus other misccalenous stuff.

---

## Tue 27 Oct 2026 — Setup and exploring the data

### What I did
- Installed Node.js (LTS, v24) so I could use npm.(node package manager)
- Created a React project with Vite: `npm create vite@latest tick-tracker -- --template react`.
- Chose **ESLint** as the linter. basically better compatibility than the other option, was reccomended anyway.
- Put the project on GitHub: `github.com/Miyelangelo17/tick-tracker`. plan to commit it daily.

### Decisions
- **Frontend task** — I already know React enough and Recharts from my training analytics app, so I can focus on building features rather than learning a new stack. I feel like this is better as i can hone on a project way better than expirement with new features in this short time frame. Probably will experiment anyway.
- **React + Vite** — fast dev server that reloads on each save. Simple project setup plus ive already used it before so its vaugely familiar.
- **Command Prompt instead of PowerShell** in VS Code (see problems below). basicaly powershell just causes too many isssues, so im using command prompt mostly.

### Problems I hit and how I fixed them
1. **`npm` not recognised** — Node.js wasn't installed. Installed the LTS version from nodejs.org and restarted VS Code.
2. **"Running scripts is disabled on this system"** — PowerShell's execution policy blocks npm's `.ps1` launcher. Switched VS Code's terminal to Command Prompt, which uses `npm.cmd` instead.
3. **Ran `git init` in my home folder by mistake** — Git started trying to add every file on my account, and note to self double check i dont do this in the future because that was strenous to reverse. Stopped it with Ctrl+C, deleted the stray `.git` folder (`rmdir /s /q .git`), then ran `git init` inside the actual project folder.
4. **Wrong GitHub remote** — my GitHub username is `Miyelangelo17`, so I updated the remote with `git remote set-url origin ...` before pushing.

### What I learned about the API (`https://dev-task.elancoapps.com/data/tick-sightings`)
- Returns **1,000 sightings** in one request, there is no API key( itb did mention this in the task sheet but was just further confirmed), CORS is enabled so the browser can call it directly. I didnt know what CORS is but essentially a security rule stops a website reading data from a different domain unless explicitly specified, however the Elanco api allows all origins, so no issues in terms of this. 
- Each sighting has: `id`, `date`, `location` (city name), `species`, `latinName`.
- **14 cities** and **5 species**; dates from 2012 to 2024.
- **No coordinates and no severity field.** Plan: map city names to coordinates with a lookup table and show one circle per city sized by number of sightings; filter by species and year instead of severity.This plan is meant to be flexible and may adjust it accordingly down the line, i may add a colour chart to the circles to add on to its severity and other ideas.
- No duplicates or missing fields in the data I checked, but I'll still skip any sighting with any missing or unknown city.

### Next
- Fetch the sightings in `App.jsx` and display them as a simple list to prove the data loads. 

### Public Library 
- went and installed the map library Leaflet, its a free popular map library, and lets me use React components. 

### Cities.js 
- I added cities.js, this is a lookup of coordinates (Latitude and Longitude) for the 14 cities listed in the data. The API however only gives the city's names and not its co-ordinates, so i had to add each city's centre point in its own place on the map. Any sighting that isnt mentioned within these cities will be ignored.

## Tue 27 Oct: Base map (~1 hour)

### Done
- Created `src/Components/TickMap.jsx`: a Leaflet map centred on the UK at zoom level 6 (might adjust later) with OpenStreetMap tiles.

### Problems and solutions
- The page still showed the list of sightings instead of the map. When I commented out the whole map section, nothing changed, which meant TickMap wasn't being used at all. Cause: I'd made the component, but App.jsx never rendered it. Fix: replaced the list in App's return with `<TickMap sightings={sightings} />`.
- A "Failed to resolve import" error kept showing. I first thought a component was mislabelled, but that wasn't it. Cause: I'd put the TickMap import inside TickMap.jsx itself. Imports go in the file that *uses* the component, and `./` paths start from the current file's folder. Debugged with help from Claude.

### Learned
- Leaflet needs its CSS import and a fixed height on the map container, or it renders broken/blank.

### Decisions
- Kept the folder as `Components` (capital C). Import paths must match exactly, because Vercel runs on Linux, which is case-sensitive (Windows isn't).
- The map only renders after the data has loaded (the loading/error checks come first). 



### Done 
- counted the sightings per city by using a loop and object as a tally, incrementing by 1 each time. All 14 cities listed up to 1000 

### Problems and Solutions 

- an extra } had closed the fucntion early, so the file had broke and browser kept showing the old version. I fixed it by deleting the brace, i also used shift + alt + f to auto format. 

- There was a comment in App.jsx that kept showing up on the page, turns out jsx uses different comment style so just fixed that from ///, to {/* */}. 

### Learned  

- how to acces console.log on a browser ( ctrl + shift + j) 
- Logs will show more than once because React runs components twice in development, and the console keeps old messages saved. 
- why the "if" was needed, this is because the first time a city appears its count will be undefined, and if i use undefined+1 in a loop it returns Nan. 
- Did have to use Claude to Debug and teach me line by line what everything meant.

### Note 
Claude did inittialise this notes page, however it is I who manually wrote in any extra information and can confirm the verity of them. This page is essentially mental reflections on any work that im doing. 

## Sat 31 Oct: Moved to PC + circles and popups 

I have been swamped with the group task among other deadlines so i had to delay this project which is annoying. the tick map and app logic have been chnaged in between today and tuesday but i didnt have the chance to review it and commit it, will do it today

### Setup on PC
- Cloned the repo from GitHub, ran `npm install` (node_modules aren't stored on GitHub, so every new machine needs this), then `npm run dev`.
- Set my git name and noreply email on the PC so commits link to my GitHub account.
- Mistake: typed `npm install dev`, which tried to install a package called "dev" (Linux-only), so it failed. `npm install` and `npm run dev` are separate commands.
- Mistake: added a full stop at the end of my git email by accident. Re-ran the command and checked it with `git config --global user.email`.

### Done
- One circle per city, sized by number of sightings.
- Circle colour shows "severity": the API has no severity field, so I compare each city with the busiest city. 85%+ = High (red), 70%+ = Medium (orange), otherwise Low (yellow).
- Clicking a circle opens a popup with the city's total, its activity level and the 5 most recent sightings.
- Quick actions in the popup: Get directions (opens Google Maps at the city) and Share (uses the device's share menu, or copies to the clipboard if there isn't one).

### How it works
- Upgraded my counter: instead of a number per city, each city now keeps a list of its sightings (`.push`). The list's `.length` is the count, and the details are there for the popup.
- Cities missing from `cities.js` are skipped with `continue`.
- `.map()` turns the list of city names into one `<CircleMarker>` per city.

### Decisions
- Severity is relative (compared to the busiest city), so the colours still make sense when the data is filtered.
- Time pressure: from this session, Claude wrote the feature code under my direction. I tested each part, committed it, and made sure I can explain how it works.  

### Styles

- “Added tabs (state, no router library), species + year filters (.filter()), a colour legend, and the popup’s Report button (App passes a function down as a prop). App handles the data, TickMap only draws what it’s given.” 

## Sat 31 Oct: Tabs, filters and legend

### Done
- Added three tabs: Map, Learn about ticks, Report a sighting.
- Added Species and Year dropdown filters above the map. They work together, e.g. "Marsh tick in 2015".
- A line above the map shows "Showing X of 1000 sightings" so the user can see the filter working.
- Added a legend under the map explaining the circle colours and sizes.
- The "Report a sighting" button in a map popup now switches to the Report tab and remembers which city was clicked.

### How it works
- Tabs: a `page` state holds 'map', 'learn' or 'report'. Each button calls `setPage(...)`, and `{page === 'map' && (...)}` only shows that section when it matches.
- Filters: each dropdown is a "controlled" input. Its value comes from state (`speciesFilter` / `yearFilter`), and `onChange` updates that state when the user picks something.
- `.filter()` keeps only the sightings where (species is All OR matches) AND (year is All OR matches).
- The year list is built from the data with the same pattern as my city counter: loop, take the first 4 characters of the date, add it if it isn't already in the list (`!years.includes(year)`), then sort.
- App passes the filtered list to TickMap, so TickMap just draws whatever it's given.
- The popup's Report button works by App passing its `handleReport` function down to TickMap as a prop (`onReport`). The child calls it, and the parent updates its state. This is how a child component tells its parent something happened.

### Decisions
- Used state for tabs instead of installing a routing library (React Router). It's three pages, so a library would add complexity for no real benefit.
- App owns the data and filters, TickMap only draws. Keeping data and display separate makes each part easier to understand and change.
- Filtered by year instead of a free date range: simpler for users, and it matches the seasonal chart idea in the brief.
- Accessibility: tabs use `aria-current="page"` so screen readers announce the active tab, and the dropdowns have labels.

## Sat 31 Oct: Learn page

### Done
- Species identification guide: a card for each of the 5 species with its Latin name, what it lives on, where it's found, a practical tip, and how many sightings are in the data.
- Prevention tips for people and pets.
- Step-by-step advice on removing a tick and when to see a GP (Lyme disease signs).
- Sources linked at the bottom of the page.

### How it works
- The species info is stored as an array of objects (`SPECIES_INFO`) and drawn with `.map()`, one card per species. Adding a species just means adding one object.
- Latin names and sighting counts come from the API data, not typed in by hand: `.find()` gets the first sighting of a species (to read its `latinName`), and `.filter().length` counts them. So the guide always matches the data.
- `match ? match.latinName : ''` is a short if/else (the "ternary" operator).

### Decisions
- Checked facts against the UK Health Security Agency's tick species profiles and NHS advice, and cited them on the page. It's health information, so it needs to be accurate and traceable.
- Pet advice included because Elanco is an animal health company and pet owners are a key audience.
- Used meaningful HTML (`section`, `article`, `h2`/`h3`) so screen readers can jump between headings (accessibility).

### Learned
- `.find()` returns one item (the first match), while `.filter()` returns a new array of every match. 

## Sat 31 Oct: Limiting the map

### Done
- Locked the map to the UK. Users can't zoom out to the world or zoom in past city level.

### How it works
- `minZoom` / `maxZoom` set how far out and in you can zoom. `maxZoom={10}` is roughly city level, which is as detailed as my data gets.
- `maxBounds` is an invisible box (bottom-left and top-right corners as [lat, lng]) that the map can't be dragged outside of. `maxBoundsViscosity={1.0}` makes the edge a hard stop instead of springing back.

### Decisions
- All the data is UK cities, so letting users wander around the world map adds nothing and can confuse them.

### Note
- GitHub Copilot autocomplete suggested the boundary coordinates. I checked them by dragging the map to each edge of the UK.