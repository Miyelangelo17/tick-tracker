import { useState, useEffect } from 'react'
import TickMap from './Components/TickMap'
import Learn from './Components/Learn'
import ReportForm from './Components/ReportForm'
import Results from './Components/Results'
import logo from './assets/tick-logo.svg'

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

  // Called by the "Report a sighting" button in a map popup
  function handleReport(city) {
    setReportCity(city)
    setPage('report')
  }

  return (
    <div className="app">
      <header>
        <h1 className="title">
          <img className="logo" src={logo} alt="" /> {/* alt="" because the title already says what it is */}
          UK Tick Tracker
        </h1>

        {/* Light/dark toggle. Shows a moon in light mode, a sun in dark mode.
            The images live in public/icons/ - swap in your own PNGs with the same names */}
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <img
            className="theme-icon"
            src={theme === 'light' ? '/icons/moon.png' : '/icons/sun.png'}
            alt=""
          />
        </button>

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

          <p>Showing {filteredSightings.length} of {allSightings.length} sightings. Click a circle for details.</p>

          {/* Map on the left, Results panel on the right (stacked on phones) */}
          <div className="map-layout">
            {/* map-frame gives the map its rounded, highlighted border (see index.css) */}
            <div className="map-frame">
              <TickMap sightings={filteredSightings} onReport={handleReport} activeCity={activeCity} />
            </div>

            <Results sightings={filteredSightings} newestDate={newestDate} onSelectCity={setActiveCity} />
          </div>

          {/* Legend explaining the circle colours */}
          <div className="legend">
            <span><span className="dot" style={{ background: '#d7301f' }}></span> High activity</span>
            <span><span className="dot" style={{ background: '#fc8d59' }}></span> Medium</span>
            <span><span className="dot" style={{ background: '#fdcc8a' }}></span> Low</span>
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