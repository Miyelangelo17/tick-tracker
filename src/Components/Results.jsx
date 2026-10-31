import { getSeverity } from '../severity'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000 // a year in milliseconds

// Results panel next to the map: the newest sightings that match the filters.
// - sightings: the filtered sightings (same list the map gets)
// - newestDate: the newest date in the whole API data, used for the "Recent" badge
function Results({ sightings, newestDate }) {
  // 1. Count sightings per city (same pattern as my first counter),
  //    so each result's dot matches its city's colour on the map
  const counts = {}
  for (const sighting of sightings) {
    const city = sighting.location
    if (counts[city] === undefined) {
      counts[city] = 1
    } else {
      counts[city] = counts[city] + 1
    }
  }
  let maxCount = 0
  for (const city of Object.keys(counts)) {
    maxCount = Math.max(maxCount, counts[city])
  }

  // 2. Newest first, keep the top 20
  const newest = [...sightings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)

  // 3. "Recent" = within a year of the newest sighting in the whole data set.
  //    (The API data stops in 2024, so comparing with today would mark nothing as recent.)
  const latestTime = new Date(newestDate).getTime()

  return (
    <aside className="results" aria-label="Newest sightings">
      <h2>Results</h2>
      <p className="results-count">Newest {newest.length} of {sightings.length} matching sightings</p>

      {newest.length === 0 && <p>No sightings match these filters.</p>}

      <ul>
        {newest.map(sighting => {
          const severity = getSeverity(counts[sighting.location], maxCount)
          const isRecent = latestTime - new Date(sighting.date).getTime() < ONE_YEAR

          return (
            <li key={sighting.id} className="result">
              <span
                className="dot"
                style={{ background: severity.colour }}
                title={`${severity.label} activity`}
              ></span>
              <div>
                <div className="result-top">
                  <strong>{sighting.location}</strong>
                  {sighting.latinName && <span className="tag">{sighting.latinName}</span>}
                  {sighting.userReported && <span className="badge">Your report</span>}
                  {isRecent && <span className="badge">Recent</span>}
                </div>
                <div className="result-meta">
                  {sighting.date.slice(0, 10)} • {sighting.species}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default Results
