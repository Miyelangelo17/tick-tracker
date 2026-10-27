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