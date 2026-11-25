import { toCityWeather } from './weatherApi';
import { WeatherResponse } from '../types/WeatherResponse';
import { GeoLocation } from '../types/GeoLocation';

test('toCityWeather takes the city name from the Geocoding API', () => {
  const weather = {
    name: 'Kosice',
    dt: Date.UTC(2026, 10, 25, 12) / 1000,
    sys: { country: 'SK' },
    weather: [{ description: 'few clouds', icon: '02d' }],
    wind: { speed: 2.5 },
    main: { temp: 1.4 },
  } as WeatherResponse;
  const location: GeoLocation = { name: 'Košice', lat: 48.72, lon: 21.25, country: 'SK' };

  expect(toCityWeather(weather, location)).toEqual({
    name: 'Košice',
    country: 'SK',
    date: 'Wednesday 25 November',
    description: 'few clouds',
    icon: '02d',
    windSpeed: 2.5,
    temp: 1.4,
  });
});
