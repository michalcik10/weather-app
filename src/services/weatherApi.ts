import axios from 'axios';
import { WeatherResponse } from '../types/WeatherResponse';
import { CityWeatherProps } from '../types/CityWeather';
import { toDate } from '../components/tools';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const APP_ID = process.env.REACT_APP_OPENWEATHER_API_KEY;

// Pass only the data the CityWeather component needs, not the whole API response.
export const toCityWeather = (data: WeatherResponse): CityWeatherProps => ({
  name: data.name,
  country: data.sys.country,
  date: toDate(new Date(data.dt * 1000)),
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  windSpeed: data.wind.speed,
  temp: data.main.temp,
});

export const fetchCityWeather = async (city: string): Promise<CityWeatherProps> => {
  const { data } = await axios.get<WeatherResponse>(API_URL, {
    params: { q: city, units: 'metric', appid: APP_ID },
  });
  return toCityWeather(data);
};
