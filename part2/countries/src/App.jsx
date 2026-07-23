import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital, lat, lon }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    if (lat && lon && apiKey) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        )
        .then((response) => setWeather(response.data))
        .catch((err) => console.error('Error fetching weather data', err))
    }
  }, [lat, lon, apiKey])

  if (!weather) return null

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const [lat, lon] = country.capitalInfo?.latlng || []

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital ? country.capital[0] : 'N/A'}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        style={{ width: '150px', border: '1px solid #ccc' }}
      />

      {country.capital && lat && lon && (
        <Weather capital={country.capital[0]} lat={lat} lon={lon} />
      )}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setAllCountries(response.data))
      .catch((err) => console.error('Failed fetching country list', err))
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const matchedCountries = search
    ? allCountries.filter((c) =>
        c.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      <div>
        {selectedCountry ? (
          <CountryDetail country={selectedCountry} />
        ) : matchedCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : matchedCountries.length > 1 ? (
          matchedCountries.map((country) => (
            <div key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </div>
          ))
        ) : matchedCountries.length === 1 ? (
          <CountryDetail country={matchedCountries[0]} />
        ) : null}
      </div>
    </div>
  )
}

export default App