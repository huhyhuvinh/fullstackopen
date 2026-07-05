import { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'

const Countries = ({ countries }) => {
    const [select, setSelect] = useState(null)

    useEffect(() => {
        setSelect(null)
    }, [countries])

    if (countries.length === 0) {
        return null
    }

    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }

    if (select && countries.find(c => c.cca3 === select.cca3)) {
        return <Country country={select} />
    }

    if (countries.length > 1) {
        return countries.map(country => (
            <div key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => setSelect(country)}>show</button>
            </div>
        ))
    }

    return <Country country={countries[0]} />
}

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)
    const languages = Object.values(country.languages || {})

    useEffect(() => {
        const api = import.meta.env.VITE_OPENWEATHER_API
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${api}&units=metric`)
            .then(response => setWeather(response.data))
    }, [weather])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <div>Capital {country.capital}</div>
            <div>Area {country.area}</div>
            <h2>Languages</h2>
            <ul>
                {languages.map(lang => <li key={lang}>{lang}</li>)}
            </ul>
            <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
            />
            <h2>Weather in {country.capital}</h2>
            {weather ?
                (
                    <div>
                        <div>Temperature {weather.main.temp} Celcius</div>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}%402x.png`}
                            alt={`Weather icon for ${weather.weather[0].description}`}
                        />
                        <div>Wind {weather.wind.speed} m/s</div>
                    </div>
                ) : <></>
            }
        </div>
    )
}

const App = () => {
    const [search, setSearch] = useState('')
    const [countries, setCountries] = useState([])

    useEffect(() => {
        axios
            .get(`${baseUrl}/api/all`)
            .then(response => {
                setCountries(response.data)
            })
            .catch(error => {
                console.error('Could not load countries:', error)
            })
    }, [])

    const handleSearch = event => {
        setSearch(event.target.value)
    }

    const searchText = search.trim().toLowerCase()

    const countriesToShow = searchText
        ? countries.filter(country =>
            country.name.common.toLowerCase().includes(searchText)
        )
        : []

    return (
        <div>
            find countries{' '}
            <input value={search} onChange={handleSearch} />
            <Countries countries={countriesToShow} />
        </div>

    )
}

export default App
