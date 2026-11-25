import { CityWeatherProps } from '../types/CityWeather';
import { WeatherResponse } from '../types/WeatherResponse';

// "Bratislava, kosice,, Bratislava " -> ['Bratislava', 'kosice']
export const parseCities = (query: string): string[] => {
  const seen = new Set<string>();
  return query
    .split(',')
    .map((city) => city.trim())
    .filter((city) => {
      const key = city.toLowerCase();
      if (!city || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

// Pass only the data the CityWeather component needs, not the whole API response.
export const toCityWeather = (data: WeatherResponse): CityWeatherProps => ({
  name: data.name,
  country: data.sys.country,
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  windSpeed: data.wind.speed,
  temp: data.main.temp,
});

export const toDate = () => {
  // let date = new Date();
  // const today = date.toDateString();
  // return today;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const currentDate = new Date();
  const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
    }`;
  return date;
};
