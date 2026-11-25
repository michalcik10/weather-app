import reducer, { fetchWeather, setQuery, WeatherState } from './weatherSlice';
import { CityWeatherProps } from '../types/CityWeather';

const initialState: WeatherState = { query: '', cities: [], notFound: [], loading: false };

const bratislava: CityWeatherProps = {
  name: 'Bratislava',
  country: 'SK',
  date: 'Wednesday 25 November',
  description: 'clear sky',
  icon: '01d',
  windSpeed: 3,
  temp: 5,
};

describe('weatherSlice', () => {
  test('setQuery stores the input text', () => {
    expect(reducer(initialState, setQuery('Bratislava')).query).toBe('Bratislava');
  });

  test('pending starts loading and clears the input', () => {
    const state = reducer(
      { ...initialState, query: 'Bratislava' },
      fetchWeather.pending('req-1', ['Bratislava'])
    );
    expect(state.loading).toBe(true);
    expect(state.query).toBe('');
    expect(state.requestId).toBe('req-1');
  });

  test('fulfilled stores found and not found cities', () => {
    let state = reducer(initialState, fetchWeather.pending('req-1', ['Bratislava', 'xyz']));
    state = reducer(
      state,
      fetchWeather.fulfilled({ cities: [bratislava], notFound: ['xyz'] }, 'req-1', ['Bratislava', 'xyz'])
    );
    expect(state.loading).toBe(false);
    expect(state.cities).toEqual([bratislava]);
    expect(state.notFound).toEqual(['xyz']);
  });

  test('ignores a response from an older search', () => {
    let state = reducer(initialState, fetchWeather.pending('old', ['Bratislava']));
    state = reducer(state, fetchWeather.pending('new', ['Kosice']));
    state = reducer(state, fetchWeather.fulfilled({ cities: [bratislava], notFound: [] }, 'old', ['Bratislava']));
    expect(state.cities).toEqual([]);
    expect(state.loading).toBe(true);
  });
});
