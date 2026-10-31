// Colours for each activity level.
// The normal palette is red/orange/yellow. The colour-blind-friendly palette
// (from "viridis", a scale designed so people with colour blindness can still
// tell the levels apart) goes dark purple -> teal -> yellow, so the levels also
// differ in brightness, not just colour.
const PALETTES = {
  normal: { High: '#d7301f', Medium: '#fc8d59', Low: '#fdcc8a' },
  colourBlind: { High: '#440154', Medium: '#21918c', Low: '#fde725' },
}

// Returns the 3 colours for the legend
export function getPalette(colourBlind) {
  return colourBlind ? PALETTES.colourBlind : PALETTES.normal
}

// Works out a "severity" for a city. The API has no severity field,
// so I compare each city's count with the busiest city's count.
// Shared by the map (circle colours) and the Results panel (dots).
export function getSeverity(count, maxCount, colourBlind) {
  const palette = getPalette(colourBlind)
  const share = count / maxCount // 1 = the busiest city, 0.5 = half as busy
  if (share >= 0.85) return { label: 'High', colour: palette.High }
  if (share >= 0.7) return { label: 'Medium', colour: palette.Medium }
  return { label: 'Low', colour: palette.Low }
}
