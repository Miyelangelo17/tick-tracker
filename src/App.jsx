import { useState, useEffect } from 'react'

const API_URL = 'https://dev-task.elancoapps.com/data/tick-sightings'

function App() {
  // 'sightings' holds the data; 'setSightings' updates it (and re-draws the page)
  const [sightings, setSightings] = useState([])
  const [error, setError] = useState(null)

  // useEffect with [] runs ONCE, when the page first loads
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())   // turn the reply into JavaScript data
      .then(data => setSightings(data))    // save it into state
      .catch(() => setError('Could not load tick sightings. Please try again later.'))
  }, [])

  if (error) return <p>{error}</p>
  if (sightings.length === 0) return <p>Loading sightings...</p>

  return (
    <div>
      <h1>UK Tick Sightings ({sightings.length})</h1>
      <ul>
        {sightings.slice(0, 50).map(s => (
          <li key={s.id}>
            {s.date.slice(0, 10)} — {s.species} in {s.location}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App