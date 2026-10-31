import { useState, useEffect } from 'react'
import TickMap from './Components/TickMap'
import Learn from './Components/Learn'
import ReportForm from './Components/ReportForm'
import Results from './Components/Results'
import { getPalette } from './severity'
import logo from './assets/tick-logo.png' // my own logo design

const API_URL = 'https://dev-task.elancoapps.com/data/tick-sightings'

const SPECIES = ['Fox/badger tick', 'Marsh tick', 'Passerine tick', 'Southern rodent tick', 'Tree-hole tick']

function App() {
  // 'sightings' holds the data; 'setSightings' updates it (and re-draws the page)
  const [sightings, setSightings] = useState([])
  const [error, setError] = useState(null)

  // Which tab is showing: 'map', 'learn' or 'report'
  const [page, setPage] = useState('map')

  // The filter dropdowns. 'All' means "don't filter"
  const [speciesFilter, setSpeciesFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')

  // The city to pre-fill on the report form (set by a popup's Report button)
  const [reportCity, setReportCity] = useState('')

  // The city whose popup should open on the map (set by hovering a card in the Results panel)
  const [activeCity, setActiveCity] = useState(null)

  // Light or dark mode. Start with the user's saved choice, otherwise their computer's setting
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Whenever 'theme' changes, put it on the <html> tag (the CSS reads it) and remember it
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Accessibility toggles (remembered like the theme).
  // localStorage stores text, so "true" === 'true' turns it back into true/false.
  const [colourBlind, setColourBlind] = useState(() => localStorage.getItem('colourBlind') === 'true')
  const [largeText, setLargeText] = useState(() => localStorage.getItem('largeText') === 'true')

  useEffect(() => {
    localStorage.setItem('colourBlind', colourBlind)
  }, [colourBlind])

  // Large text: put data-text-size="large" on the <html> tag; the CSS scales every font size
  useEffect(() => {
    document.documentElement.dataset.textSize = largeText ? 'large' : 'normal'
    localStorage.setItem('largeText', largeText)
  }, [largeText])

  // Sightings reported by the user, loaded from the browser's localStorage.
  // localStorage only stores text, so JSON.parse turns it back into data.
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('tickReports')
      return saved ? JSON.parse(saved) : []
    } catch {
      return [] // if the saved data is unreadable, start with no reports
    }
  })

  // useEffect with [] runs ONCE, when the page first loads
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())   // turn the reply into JavaScript data
      .then(data => setSightings(data))    // save it into state
      .catch(() => setError('Could not load tick sightings. Please try again later.'))
  }, [])

  if (error) return <p>{error}</p>
  if (sightings.length === 0) return <p>Loading sightings...</p>

  // API sightings + the user's own reports, so reports show on the map too
  const allSightings = [...sightings, ...reports]

  // Called by the report form when a valid report is submitted
  function handleAddReport(report) {
    // Look up the Latin name for the species from the API data
    const match = sightings.find(sighting => sighting.species === report.species)
    const fullReport = { ...report, latinName: match ? match.latinName : '' }

    const updatedReports = [...reports, fullReport]
    setReports(updatedReports) // update the page
    localStorage.setItem('tickReports', JSON.stringify(updatedReports)) // save in the browser
  }

  // Build the list of years for the year dropdown (same pattern as my city counter)
  const years = []
  for (const sighting of allSightings) {
    const year = sighting.date.slice(0, 4) // "2022-08-01T06:40:31" -> "2022"
    if (!years.includes(year)) {
      years.push(year)
    }
  }
  years.sort()

  // The newest date in the API data (dates are text like "2024-12-18T...", which compare correctly as text)
  let newestDate = ''
  for (const sighting of sightings) {
    if (sighting.date > newestDate) {
      newestDate = sighting.date
    }
  }

  // Keep only the sightings that match BOTH dropdowns
  const filteredSightings = allSightings.filter(sighting =>
    (speciesFilter === 'All' || sighting.species === speciesFilter) &&
    (yearFilter === 'All' || sighting.date.startsWith(yearFilter))
  )

  // The 3 legend colours (normal or colour-blind-friendly)
  const palette = getPalette(colourBlind)

  // Called by the "Report a sighting" button in a map popup
  function handleReport(city) {
    setReportCity(city)
    setPage('report')
  }

  return (
    <div className="app">
      <header>
        {/* Logo in the top-left corner. alt="" because the title already says what it is */}
        <img className="logo" src={logo} alt="" />

        <h1 className="title">UK Tick Tracker</h1>

        {/* Toolbar in the top-right corner. The icons live in public/icons/ -
            swap in your own PNGs with the same names */}
        <div className="toolbar">
          {/* Light/dark toggle: moon in light mode, sun in dark mode */}
          <button
            className="tool-button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <img className="tool-icon" src={theme === 'light' ? '/icons/moon.png' : '/icons/sun.png'} alt="" />
          </button>

          {/* Colour-blind-friendly map colours. aria-pressed tells screen readers it's on/off */}
          <button
            className="tool-button"
            onClick={() => setColourBlind(!colourBlind)}
            aria-pressed={colourBlind}
            aria-label="Colour-blind-friendly colours"
            title="Colour-blind-friendly colours"
          >
            <img className="tool-icon" src="/icons/colourblind.png" alt="" />
          </button>

          {/* Magnifier: makes all the text bigger */}
          <button
            className="tool-button"
            onClick={() => setLargeText(!largeText)}
            aria-pressed={largeText}
            aria-label="Larger text"
            title="Larger text"
          >
            <img className="tool-icon" src="/icons/magnifier.png" alt="" />
          </button>
        </div>

        {/* Tabs: clicking one changes 'page', which changes what is shown below */}
        <nav>
          <button onClick={() => setPage('map')} aria-current={page === 'map' ? 'page' : undefined}>
            Map
          </button>
          <button onClick={() => setPage('learn')} aria-current={page === 'learn' ? 'page' : undefined}>
            Learn about ticks
          </button>
          <button onClick={() => { setReportCity(''); setPage('report') }} aria-current={page === 'report' ? 'page' : undefined}>
            Report a sighting
          </button>
        </nav>
      </header>

      {page === 'map' && (
        <main>
          <div className="filters">
            <label>
              Species:{' '}
              <select value={speciesFilter} onChange={e => setSpeciesFilter(e.target.value)}>
                <option value="All">All species</option>
                {SPECIES.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </label>

            <label>
              Year:{' '}
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                <option value="All">All years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Map on the left, Results panel on the right (stacked on phones) */}
          <div className="map-layout">
            {/* map-frame gives the map its rounded, highlighted border (see index.css) */}
            <div className="map-frame">
              <TickMap sightings={filteredSightings} onReport={handleReport} activeCity={activeCity} colourBlind={colourBlind} />
            </div>

            <Results sightings={filteredSightings} newestDate={newestDate} onSelectCity={setActiveCity} colourBlind={colourBlind} />
          </div>

          {/* Legend explaining the circle colours */}
          <div className="legend">
            <span><span className="dot" style={{ background: palette.High }}></span> High activity</span>
            <span><span className="dot" style={{ background: palette.Medium }}></span> Medium</span>
            <span><span className="dot" style={{ background: palette.Low }}></span> Low</span>
            <span>Bigger circle = more sightings</span>
          </div>
        </main>
      )}

      {page === 'learn' && (
        <main>
          <Learn sightings={allSightings} />
        </main>
      )}

      {page === 'report' && (
        <main>
          <ReportForm initialCity={reportCity} speciesList={SPECIES} onSubmit={handleAddReport} />
        </main>
      )}

      <footer>
        <p>Prototype built by Miyelangelo Dell'Ovo Mujica for the Elanco placement technical task.</p>
        <p>Sighting data: Elanco tick sightings API · Map: © OpenStreetMap contributors</p>
      </footer>
    </div>
  )
}

export default App