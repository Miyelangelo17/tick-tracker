import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CITY_CORDS } from '../cities';

// Works out a "severity" for a city. The API has no severity field,
// so I compare each city's count with the busiest city's count.
function getSeverity(count, maxCount) {
  const share = count / maxCount; // 1 = the busiest city, 0.5 = half as busy
  if (share >= 0.85) return { label: 'High', colour: '#d7301f' };   // red
  if (share >= 0.7) return { label: 'Medium', colour: '#fc8d59' };  // orange
  return { label: 'Low', colour: '#fdcc8a' };                       // yellow
}

// Share button: uses the device's share menu if it has one,
// otherwise copies a message to the clipboard.
function shareCity(city, count) {
  const text = `${count} tick sightings reported in ${city}. Check before your next walk!`;
  if (navigator.share) {
    navigator.share({ title: 'UK Tick Tracker', text: text, url: window.location.href })
      .catch(() => {}); // ignore it if the user closes the share menu
  } else {
    navigator.clipboard.writeText(text + ' ' + window.location.href);
    alert('Copied to clipboard');
  }
}

function TickMap({ sightings, onReport }) {
  // 1. Group the sightings by city: { London: [sighting, sighting, ...], Leeds: [...] }
  //    Same idea as my counter, but each city keeps a LIST of its sightings
  //    instead of a number, so the popup can show details.
  const sightingsByCity = {};

  for (const sighting of sightings) {
    const city = sighting.location;

    if (CITY_CORDS[city] === undefined) {
      continue; // skip any city I don't have coordinates for
    }

    if (sightingsByCity[city] === undefined) {
      sightingsByCity[city] = []; // first time seeing this city: start an empty list
    }
    sightingsByCity[city].push(sighting); // add this sighting to the city's list
  }

  // 2. Get the list of city names, and find the biggest count (for sizing/colouring)
  const cityNames = Object.keys(sightingsByCity); // ["London", "Leeds", ...]
  let maxCount = 0;
  for (const city of cityNames) {
    maxCount = Math.max(maxCount, sightingsByCity[city].length);
  }

  // 3. Draw the map, with one circle per city
  return (
    <MapContainer
      center={[54.5, -3]}
      zoom={6}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cityNames.map(city => {
        const citySightings = sightingsByCity[city];
        const count = citySightings.length;
        const severity = getSeverity(count, maxCount);
        const { lat, lng } = CITY_CORDS[city];

        // Newest first: sort a copy by date (dates are text like "2022-08-01T06:40:31",
        // which sorts correctly as text), then keep the first 5
        const recent = [...citySightings]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5);

        return (
          <CircleMarker
            key={city}
            center={[lat, lng]}
            radius={6 + (count / maxCount) * 18} // bigger circle = more sightings
            pathOptions={{ color: '#333', weight: 1, fillColor: severity.colour, fillOpacity: 0.8 }}
          >
            <Popup>
              <h3>{city}</h3>
              <p>
                <strong>{count}</strong> sightings · <strong>{severity.label}</strong> activity
              </p>

              <p>Most recent:</p>
              <ul>
                {recent.map(s => (
                  <li key={s.id}>
                    {s.date.slice(0, 10)} — {s.species}
                  </li>
                ))}
              </ul>

              {/* Quick action buttons */}
              <div className="popup-actions">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions
                </a>
                <button onClick={() => shareCity(city, count)}>Share</button>
                {onReport && <button onClick={() => onReport(city)}>Report a sighting</button>}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default TickMap;