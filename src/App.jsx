import { useState, useEffect } from 'react' 
import TickMap from './Components/TickMap';  /// imports the TickMap component from the Components folder  

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
      <TickMap sightings={sightings} />  {/* passes the sightings data to the TickMap component as a prop */}
    </div>
  )
}

export default App