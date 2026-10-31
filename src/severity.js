// Works out a "severity" for a city. The API has no severity field,
// so I compare each city's count with the busiest city's count.
// Shared by the map (circle colours) and the Results panel (dots).
export function getSeverity(count, maxCount) {
  const share = count / maxCount; // 1 = the busiest city, 0.5 = half as busy
  if (share >= 0.85) return { label: 'High', colour: '#d7301f' };   // red
  if (share >= 0.7) return { label: 'Medium', colour: '#fc8d59' };  // orange
  return { label: 'Low', colour: '#fdcc8a' };                       // yellow
}
