import React, { FunctionComponent } from 'react';
import { CityWeatherProps } from '../types/CityWeather';

// Pure presentational component: renders only what it gets in props.
export const CityWeather: FunctionComponent<CityWeatherProps> = ({ name, country, date, description, icon, windSpeed, temp }) => (
  <div className="city-weather">
    <div className="city-name">
      <h2>
        {name}, <span>{country}</span>
      </h2>
    </div>
    <div className="date">
      <span>{date}</span>
    </div>
    <div className="icon-temp">
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
      />
      {Math.round(temp)}
      <sup className="deg">&deg;C</sup>
    </div>
    <div className="des-wind">
      <p>{description.toUpperCase()}</p>
      <p>Wind Speed: {windSpeed}m/s</p>
    </div>
  </div>
);
