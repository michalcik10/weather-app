import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from './index';
import { CityWeatherProps } from '../types/CityWeather';
import { fetchCityWeather } from '../services/weatherApi';
import { parseCities } from '../components/tools';

export type WeatherState = {
  query: string;
  cities: CityWeatherProps[];
  notFound: string[];
  loading: boolean;
};

const initialState: WeatherState = {
  query: '',
  cities: [],
  notFound: [],
  loading: false,
};

export const fetchWeather = createAsyncThunk('weather/fetch', async (names: string[]) => {
  // allSettled: one unknown city must not break the results for the others
  const results = await Promise.allSettled(names.map(fetchCityWeather));

  const cities: CityWeatherProps[] = [];
  const notFound: string[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const city = result.value;
      // e.g. "Praha, Prague" returns the same city twice
      if (!cities.some((c) => c.name === city.name && c.country === city.country)) {
        cities.push(city);
      }
    } else {
      notFound.push(names[index]);
    }
  });

  return { cities, notFound };
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.query = '';
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload.cities;
        state.notFound = action.payload.notFound;
      })
      .addCase(fetchWeather.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setQuery } = weatherSlice.actions;

export const selectQuery = (state: RootState) => state.weather.query;
export const selectCities = (state: RootState) => state.weather.cities;
export const selectNotFound = (state: RootState) => state.weather.notFound;
export const selectLoading = (state: RootState) => state.weather.loading;

// On Enter: read the query from the store, split it into cities and fetch them.
export const submitSearch = (): AppThunk => (dispatch, getState) => {
  const names = parseCities(selectQuery(getState()));
  if (names.length > 0) {
    dispatch(fetchWeather(names));
  }
};

export default weatherSlice.reducer;
