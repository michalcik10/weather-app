import axios from 'axios';
import { WeatherResponse } from '../types/WeatherResponse';
import { GeoLocation } from '../types/GeoLocation';
import { CityWeatherProps } from '../types/CityWeather';
import { toDate } from '../components/tools';

const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const APP_ID = process.env.REACT_APP_OPENWEATHER_API_KEY;

// Pass only the data the CityWeather component needs, not the whole API response.
// The city name comes from the Geocoding API, the weather endpoint often returns it without diacritics.
export const toCityWeather = (data: WeatherResponse, location: GeoLocation): CityWeatherProps => ({
  name: location.name,
  country: location.country,
  date: toDate(new Date(data.dt * 1000)),
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  windSpeed: data.wind.speed,
  temp: data.main.temp,
});

export const fetchCityWeather = async (city: string): Promise<CityWeatherProps> => {
  const { data: locations } = await axios.get<GeoLocation[]>(GEO_URL, {
    params: { q: city, limit: 1, appid: APP_ID },
  });
  if (locations.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  const location = locations[0];
  const { data } = await axios.get<WeatherResponse>(WEATHER_URL, {
    params: { lat: location.lat, lon: location.lon, units: 'metric', appid: APP_ID },
  });
  return toCityWeather(data, location);
};
