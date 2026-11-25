import reducer, { fetchWeather, setQuery, WeatherState } from './weatherSlice';
import { CityWeatherProps } from '../types/CityWeather';

const initialState: WeatherState = {
  query: '',
  cities: [],
  notFound: [],
  failed: [],
  error: null,
  loading: false,
};

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

  test('fulfilled stores found, not found and failed cities', () => {
    const names = ['Bratislava', 'xyz', 'Kosice'];
    let state = reducer(initialState, fetchWeather.pending('req-1', names));
    state = reducer(
      state,
      fetchWeather.fulfilled({ cities: [bratislava], notFound: ['xyz'], failed: ['Kosice'] }, 'req-1', names)
    );
    expect(state.loading).toBe(false);
    expect(state.cities).toEqual([bratislava]);
    expect(state.notFound).toEqual(['xyz']);
    expect(state.failed).toEqual(['Kosice']);
    expect(state.error).toBeNull();
  });

  test('rejected (e.g. missing API key) shows the error and clears old results', () => {
    let state = reducer({ ...initialState, cities: [bratislava] }, fetchWeather.pending('req-1', ['Kosice']));
    state = reducer(state, fetchWeather.rejected(null, 'req-1', ['Kosice'], 'API key is missing'));
    expect(state.loading).toBe(false);
    expect(state.cities).toEqual([]);
    expect(state.error).toBe('API key is missing');
  });

  test('ignores a response from an older search', () => {
    let state = reducer(initialState, fetchWeather.pending('old', ['Bratislava']));
    state = reducer(state, fetchWeather.pending('new', ['Kosice']));
    state = reducer(
      state,
      fetchWeather.fulfilled({ cities: [bratislava], notFound: [], failed: [] }, 'old', ['Bratislava'])
    );
    expect(state.cities).toEqual([]);
    expect(state.loading).toBe(true);
  });
});
