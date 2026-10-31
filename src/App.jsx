import { useState, useEffect } from 'react'
import TickMap from './Components/TickMap'

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

  // useEffect with [] runs ONCE, when the page first loads
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())   // turn the reply into JavaScript data
      .then(data => setSightings(data))    // save it into state
      .catch(() => setError('Could not load tick sightings. Please try again later.'))
  }, [])

  if (error) return <p>{error}</p>
  if (sightings.length === 0) return <p>Loading sightings...</p>

  // Build the list of years for the year dropdown (same pattern as my city counter)
  const years = []
  for (const sighting of sightings) {
    const year = sighting.date.slice(0, 4) // "2022-08-01T06:40:31" -> "2022"
    if (!years.includes(year)) {
      years.push(year)
    }
  }
  years.sort()

  // Keep only the sightings that match BOTH dropdowns
  const filteredSightings = sightings.filter(sighting =>
    (speciesFilter === 'All' || sighting.species === speciesFilter) &&
    (yearFilter === 'All' || sighting.date.startsWith(yearFilter))
  )

  // Called by the "Report a sighting" button in a map popup
  function handleReport(city) {
    setReportCity(city)
    setPage('report')
  }

  return (
    <div>
      <header>
        <h1>UK Tick Tracker</h1>

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

          <p>Showing {filteredSightings.length} of {sightings.length} sightings. Click a circle for details.</p>

          <TickMap sightings={filteredSightings} onReport={handleReport} />

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
          <p>Education page coming next.</p>
        </main>
      )}

      {page === 'report' && (
        <main>
          <p>Report form coming next. City from popup: {reportCity || 'none'}</p>
        </main>
      )}
    </div>
  )
}

export default App