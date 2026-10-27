import { MapContainer, TileLayer } from 'react-leaflet'; /// imports from the package 
import 'leaflet/dist/leaflet.css';  /// imports the CSS for leaflet so that the map displays correctly

function TickMap({ sightings }) {  
         const counts = {};

for (const sighting of sightings) {
  const city = sighting.location;

  if (counts[city] === undefined) {
    counts[city] = 1;
  } else {
    counts[city] = counts[city] + 1;
  }
}

console.log(counts); /// logs the location of each sighting to the console for debugging purposes 
     
  return (
    <MapContainer             /// JSX component that creates a map. It takes props to set the center, zoom level, and style of the map. similair to HTML style 
      center={[54.5, -3]}
      zoom={6}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default TickMap; 