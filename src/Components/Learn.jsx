// Education page: species identification guide + prevention tips.
// Facts come from the UK Health Security Agency's tick species profiles
// and NHS tick bite advice (links at the bottom of the page).

const SPECIES_INFO = [
  {
    name: 'Fox/badger tick',
    hosts: 'Badgers, foxes and domestic dogs',
    where: 'Widely distributed throughout the UK',
    tip: 'One of the ticks you may find on your dog, so check them after walks.',
  },
  {
    name: 'Marsh tick',
    hosts: 'Water voles',
    where: 'Prefers wetland habitats, e.g. fens and marshes',
    tip: 'Take extra care on walks near rivers, marshes and wetlands.',
  },
  {
    name: 'Passerine tick',
    hosts: 'Birds, especially perching birds (passerines)',
    where: 'England, with newer records in Wales',
    tip: 'Sometimes found feeding on humans.',
  },
  {
    name: 'Southern rodent tick',
    hosts: 'Small rodents such as mice and voles',
    where: 'Lives in rodent burrows, mainly in southern England',
    tip: 'Rarely seen out in the open, as it lives underground in burrows.',
  },
  {
    name: 'Tree-hole tick',
    hosts: 'Birds that nest in tree holes, such as great tits and blue tits',
    where: 'Tree holes and nest boxes, mostly in England',
    tip: 'Wear gloves when cleaning out bird nest boxes.',
  },
]

function Learn({ sightings }) {
  // Find the Latin name for a species from the API data
  // (.find returns the FIRST sighting that matches)
  function getLatinName(speciesName) {
    const match = sightings.find(sighting => sighting.species === speciesName)
    return match ? match.latinName : ''
  }

  // Count how many sightings of a species are in the data
  function countSightings(speciesName) {
    return sightings.filter(sighting => sighting.species === speciesName).length
  }

  return (
    <div className="learn">
      <section>
        <h2>Species identification guide</h2>
        <div className="cards">
          {SPECIES_INFO.map(species => (
            <article className="card" key={species.name}>
              <h3>{species.name}</h3>
              <p className="latin">{getLatinName(species.name)}</p>
              <p><strong>Found on:</strong> {species.hosts}</p>
              <p><strong>Where:</strong> {species.where}</p>
              <p><strong>Tip:</strong> {species.tip}</p>
              <p className="count">{countSightings(species.name)} sightings recorded</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Prevention tips</h2>
        <ul>
          <li>Stick to paths and avoid brushing against long grass and dense undergrowth.</li>
          <li>Cover your skin: long sleeves, and trousers tucked into your socks.</li>
          <li>Wear light-coloured clothing so ticks are easier to spot and brush off.</li>
          <li>Use an insect repellent that says it works against ticks.</li>
          <li>After being outdoors, check yourself, your children and your pets, especially armpits, behind the knees, the hairline and, on pets, around the ears, neck and legs.</li>
          <li>Ask your vet about tick prevention for your pets.</li>
        </ul>
      </section>

      <section>
        <h2>If you find a tick</h2>
        <ol>
          <li>Remove it as soon as possible, using fine-tipped tweezers or a tick removal tool.</li>
          <li>Grip it as close to the skin as you can and pull upwards slowly and steadily. Don't squeeze or crush it.</li>
          <li>Clean the bite with antiseptic or soap and water.</li>
          <li>See a GP if you get a circular or "bull's-eye" rash, or flu-like symptoms such as fever, headache or tiredness. These can be signs of Lyme disease, which is treatable with antibiotics.</li>
        </ol>
      </section>

      <p className="sources">
        Sources:{' '}
        <a href="https://www.gov.uk/guidance/tick-species-profiles" target="_blank" rel="noreferrer">UKHSA tick species profiles</a>
        {' · '}
        <a href="https://www.nhs.uk/conditions/lyme-disease/" target="_blank" rel="noreferrer">NHS: Lyme disease</a>
      </p>
    </div>
  )
}

export default Learn