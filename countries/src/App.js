import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;
console.log(apiKey);
const Weather = ({ country }) => {
  const [weather, setWeather] = useState("");
  useEffect(() => {
    axios
      .get(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${country.capital}`
      )
      .then((response) => setWeather(response.data));
  }, []);
  try {
    return (
      <>
        <h2>The weather in {country.capital}</h2>
        <p>
          {" "}
          {weather.current.temp_f}°f and {weather.current.condition.text}
        </p>
      </>
    );
  } catch (e) {
    return <p>working</p>;
  }
};

const DisplayCountries = ({ filterTerm, filteredCountries, setFilterTerm }) => {
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p> capital {country.capital}</p>
        <p> area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((language) => {
            return <li key={language}>{language}</li>;
          })}
        </ul>
        <div>{country.flag}</div>
        <Weather country={country} />
      </div>
    );
  }
  if (filterTerm === "") {
    return <div>Search For a Country</div>;
  } else if (filteredCountries.length > 10) {
    return <div>Too Many Results</div>;
  } else {
    return (
      <div>
        {filteredCountries.map((country) => {
          return (
            <div key={country.name.common}>
              {country.name.common}
              <button
                value={country.name.common}
                onClick={(e) => {
                  setFilterTerm(e.target.value);
                }}
              >
                Show
              </button>
            </div>
          );
        })}
      </div>
    );
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data));
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterTerm.toLowerCase())
  );
  var data = countries;
  return (
    <div>
      find countries
      <input
        value={filterTerm}
        onChange={(e) => setFilterTerm(e.target.value)}
      />
      <DisplayCountries
        filterTerm={filterTerm}
        filteredCountries={filteredCountries}
        setFilterTerm={setFilterTerm}
      />
    </div>
  );
};

export default App;
