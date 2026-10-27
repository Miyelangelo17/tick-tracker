# Development Notes — UK Tick Tracker

A short log of what I did each session, the decisions I made, and the problems I solved.

---

## Tue 27 Oct 2026 — Setup and exploring the data

### What I did
- Installed Node.js (LTS, v24) so I could use npm.
- Created a React project with Vite: `npm create vite@latest tick-tracker -- --template react`.
- Chose **ESLint** as the linter (industry standard, most documentation and support).
- Put the project on GitHub: `github.com/Miyelangelo17/tick-tracker`.

### Decisions
- **Frontend task** — I already know React and Recharts from my training analytics app, so I can focus on building features rather than learning a new stack.
- **React + Vite** — fast dev server that reloads on save; simple project setup.
- **Command Prompt instead of PowerShell** in VS Code (see problems below).

### Problems I hit and how I fixed them
1. **`npm` not recognised** — Node.js wasn't installed. Installed the LTS version from nodejs.org and restarted VS Code.
2. **"Running scripts is disabled on this system"** — PowerShell's execution policy blocks npm's `.ps1` launcher. Switched VS Code's terminal to Command Prompt, which uses `npm.cmd` instead.
3. **Ran `git init` in my home folder by mistake** — Git started trying to add every file on my account. Stopped it with Ctrl+C, deleted the stray `.git` folder (`rmdir /s /q .git`), then ran `git init` inside the project folder.
4. **Git identity not set** — set `user.name` and `user.email` (using GitHub's private noreply address so my email isn't public), then re-signed the commit with `git commit --amend --reset-author --no-edit`.
5. **Wrong GitHub remote** — my GitHub username is `Miyelangelo17`, so I updated the remote with `git remote set-url origin ...` before pushing.

### What I learned about the API (`https://dev-task.elancoapps.com/data/tick-sightings`)
- Returns **1,000 sightings** in one request; no API key; CORS is enabled so the browser can call it directly.
- Each sighting has: `id`, `date`, `location` (city name), `species`, `latinName`.
- **14 cities** and **5 species**; dates from 2012 to 2024.
- **No coordinates and no severity field.** Plan: map city names to coordinates with a lookup table and show one circle per city sized by number of sightings; filter by species and year instead of severity.
- No duplicates or missing fields in the data I checked, but I'll still skip any sighting with a missing or unknown city.

### Next
- Fetch the sightings in `App.jsx` and display them as a simple list to prove the data loads.
