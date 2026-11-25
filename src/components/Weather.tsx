import React, { FunctionComponent } from 'react';
import { InfinitySpin } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import { CityWeather } from './CityWeather';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectCities,
  selectError,
  selectFailed,
  selectLoading,
  selectNotFound,
  selectQuery,
  setQuery,
  submitSearch,
} from '../store/weatherSlice';

const ErrorMessage: FunctionComponent<{ text: string }> = ({ text }) => (
  <>
    <br />
    <br />
    <span className="error-message">
      <FontAwesomeIcon icon={faFrown} />
      <span style={{ fontSize: '20px' }}> {text}</span>
    </span>
  </>
);

// No local state and no API calls: data comes from the store, user actions are dispatched.
const Weather: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectQuery);
  const cities = useAppSelector(selectCities);
  const notFound = useAppSelector(selectNotFound);
  const failed = useAppSelector(selectFailed);
  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      dispatch(submitSearch());
    }
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
          onChange={(event) => dispatch(setQuery(event.target.value))}
          onKeyDown={onKeyDown}
        />
      </div>

      {loading && (
        <>
          <br />
          <br />
          <InfinitySpin width="200" />
        </>
      )}

      {!loading && (
        <>
          {error && <ErrorMessage text={error} />}
          {notFound.length > 0 && <ErrorMessage text={`Sorry, City not found: ${notFound.join(', ')}`} />}
          {failed.length > 0 && (
            <ErrorMessage text={`Could not load weather for: ${failed.join(', ')}. Please try again.`} />
          )}
          {cities.map((city) => (
            <CityWeather key={`${city.name}-${city.country}`} {...city} />
          ))}
        </>
      )}
    </div>
  );
};

export default Weather;
