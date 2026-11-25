import React, { FunctionComponent, useState } from 'react';
import axios from 'axios';
import { InfinitySpin } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import { WeatherResponse } from '../types/WeatherResponse';
import { CityWeatherProps } from '../types/CityWeather';
import { CityWeather } from './CityWeather';
import { parseCities, toCityWeather } from './tools';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const APP_ID = process.env.REACT_APP_OPENWEATHER_API_KEY;

type WeatherState = {
  loading: boolean;
  cities: CityWeatherProps[];
  notFound: string[];
};

const Weather: FunctionComponent = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherState>({
    loading: false,
    cities: [],
    notFound: [],
  });

  const search = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();

    const names = parseCities(query);
    if (names.length === 0) {
      return;
    }

    setQuery('');
    setWeather((prev) => ({ ...prev, loading: true }));

    // allSettled: one unknown city must not break the results for the others
    const results = await Promise.allSettled(
      names.map((q) =>
        axios.get<WeatherResponse>(API_URL, { params: { q, units: 'metric', appid: APP_ID } })
      )
    );

    const cities: CityWeatherProps[] = [];
    const notFound: string[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const city = toCityWeather(result.value.data);
        // e.g. "Praha, Prague" returns the same city twice
        if (!cities.some((c) => c.name === city.name && c.country === city.country)) {
          cities.push(city);
        }
      } else {
        notFound.push(names[index]);
      }
    });

    setWeather({ loading: false, cities, notFound });
  };

  return (
    <div>
      <h1 className="app-name">
        Weather App<span>🌤</span>
      </h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Search City.. (Bratislava, Kosice)"
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={search}
        />
      </div>

      {weather.loading && (
        <>
          <br />
          <br />
          <InfinitySpin width="200" />
        </>
      )}

      {!weather.loading && weather.notFound.length > 0 && (
        <>
          <br />
          <br />
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ fontSize: '20px' }}> Sorry, City not found: {weather.notFound.join(', ')}</span>
          </span>
        </>
      )}

      {!weather.loading &&
        weather.cities.map((city) => (
          <CityWeather key={`${city.name}-${city.country}`} {...city} />
        ))}
    </div>
  );
};

export default Weather;
