import { useState } from 'react'
import { CITY_CORDS } from '../cities'

// Form for reporting a new tick sighting.
// - initialCity: pre-fills the location (when opened from a map popup)
// - speciesList: the 5 species for the dropdown
// - onSubmit: function from App that saves the report
function ReportForm({ initialCity, speciesList, onSubmit }) {
  // One piece of state per form field
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [city, setCity] = useState(initialCity)
  const [species, setSpecies] = useState('')
  const [photo, setPhoto] = useState(null)          // the chosen image file
  const [photoPreview, setPhotoPreview] = useState('') // a temporary link to show it

  // Messages shown to the user
  const [errors, setErrors] = useState([])
  const [warning, setWarning] = useState('')
  const [success, setSuccess] = useState('')

  const cityNames = Object.keys(CITY_CORDS).sort()
  const today = new Date().toISOString().slice(0, 10) // e.g. "2026-10-31"

  // Runs when the user picks a photo
  function handlePhotoChange(e) {
    const file = e.target.files[0] // the first (only) file chosen
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file)) // lets an <img> show the file
    } else {
      setPhoto(null)
      setPhotoPreview('')
    }
  }

  // Runs when the user clicks "Submit report"
  function handleSubmit(e) {
    e.preventDefault() // stop the browser's default behaviour (reloading the page)

    // 1. Check every field and collect any problems
    const newErrors = []
    if (!date) newErrors.push('Please enter the date of the sighting.')
    if (!time) newErrors.push('Please enter the time of the sighting.')
    if (date && time && new Date(`${date}T${time}`) > new Date()) {
      newErrors.push("The date and time can't be in the future.")
    }
    if (!city) newErrors.push('Please choose a location.')
    if (!species) newErrors.push('Please choose a species.')
    if (photo && !photo.type.startsWith('image/')) {
      newErrors.push('The photo must be an image file, such as JPG or PNG.')
    }
    if (photo && photo.size > 5 * 1024 * 1024) {
      newErrors.push('The photo must be smaller than 5 MB.')
    }

    setErrors(newErrors)
    setSuccess('')
    setWarning('')

    // 2. If there are any errors, stop here (nothing is saved)
    if (newErrors.length > 0) return

    // 3. No errors: build the report in the same shape as the API's sightings,
    //    so the map can treat it like any other sighting
    onSubmit({
      id: 'user-' + Date.now(), // a unique id from the current time
      date: `${date}T${time}:00`,
      location: city,
      species: species,
      photoName: photo ? photo.name : null,
      userReported: true,
    })

    setSuccess(`Thank you! Your ${species} sighting in ${city} has been saved and added to the map.`)
    if (!photo) {
      setWarning('No photo was attached. Adding a photo next time helps confirm the species.')
    }

    // 4. Clear the form for the next report
    setDate('')
    setTime('')
    setCity('')
    setSpecies('')
    setPhoto(null)
    setPhotoPreview('')
    e.target.reset() // also clears the file picker
  }

  return (
    <div className="report">
      <h2>Report a tick sighting</h2>
      <p className="required-note">Fields marked <span className="required">*</span> are required.</p>

      {/* Messages. role="alert"/"status" makes screen readers read them out */}
      {errors.length > 0 && (
        <div className="message error" role="alert">
          <strong>Please fix the following:</strong>
          <ul>
            {errors.map(message => <li key={message}>{message}</li>)}
          </ul>
        </div>
      )}
      {success && <div className="message success" role="status">{success}</div>}
      {warning && <div className="message warning" role="status">{warning}</div>}

      {/* noValidate turns off the browser's own pop-ups so my messages are used instead.
          The red * is hidden from screen readers (aria-hidden); the 'required' attribute
          on each field tells them instead, so they hear "required" rather than "star". */}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="date">Date <span className="required" aria-hidden="true">*</span></label>
        <input id="date" type="date" required max={today} value={date} onChange={e => setDate(e.target.value)} />

        <label htmlFor="time">Time <span className="required" aria-hidden="true">*</span></label>
        <input id="time" type="time" required value={time} onChange={e => setTime(e.target.value)} />

        <label htmlFor="city">Location <span className="required" aria-hidden="true">*</span></label>
        <select id="city" required value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Choose a city</option>
          {cityNames.map(name => <option key={name} value={name}>{name}</option>)}
        </select>

        <label htmlFor="species">Species <span className="required" aria-hidden="true">*</span></label>
        <select id="species" required value={species} onChange={e => setSpecies(e.target.value)}>
          <option value="">Choose a species</option>
          {speciesList.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <p className="hint">Not sure? Check the "Learn about ticks" page.</p>

        <label htmlFor="photo">Photo (optional, max 5 MB)</label>
        <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
        {photoPreview && <img className="preview" src={photoPreview} alt="Preview of the uploaded tick photo" />}

        <button type="submit">Submit report</button>
      </form>
    </div>
  )
}

export default ReportForm