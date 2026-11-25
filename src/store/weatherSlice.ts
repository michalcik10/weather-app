import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from './index';
import { CityWeatherProps } from '../types/CityWeather';
import { fetchCityWeather, hasApiKey } from '../services/weatherApi';
import { parseCities } from '../components/tools';

export type WeatherState = {
  query: string;
  cities: CityWeatherProps[];
  // cities the API does not know
  notFound: string[];
  // cities that could not be loaded (invalid API key, network error, rate limit...)
  failed: string[];
  // error that stopped the whole search
  error: string | null;
  loading: boolean;
  // id of the latest search, older responses are ignored
  requestId?: string;
};

const initialState: WeatherState = {
  query: '',
  cities: [],
  notFound: [],
  failed: [],
  error: null,
  loading: false,
};

type SearchResult = Pick<WeatherState, 'cities' | 'notFound' | 'failed'>;

export const fetchWeather = createAsyncThunk<SearchResult, string[], { rejectValue: string }>(
  'weather/fetch',
  async (names, { rejectWithValue }) => {
    if (!hasApiKey()) {
      return rejectWithValue('API key is missing, see README (Setup).');
    }

    // allSettled: one unknown city must not break the results for the others
    const results = await Promise.allSettled(names.map(fetchCityWeather));

    const cities: CityWeatherProps[] = [];
    const notFound: string[] = [];
    const failed: string[] = [];
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        failed.push(names[index]);
        return;
      }
      const city = result.value;
      if (city === null) {
        notFound.push(names[index]);
        return;
      }
      // e.g. "Praha, Prague" returns the same city twice
      if (!cities.some((c) => c.name === city.name && c.country === city.country)) {
        cities.push(city);
      }
    });

    return { cities, notFound, failed };
  }
);

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
      .addCase(fetchWeather.pending, (state, action) => {
        state.loading = true;
        state.query = '';
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        // a slower older search must not overwrite the results of a newer one
        if (action.meta.requestId !== state.requestId) {
          return;
        }
        state.loading = false;
        state.error = null;
        state.cities = action.payload.cities;
        state.notFound = action.payload.notFound;
        state.failed = action.payload.failed;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) {
          return;
        }
        state.loading = false;
        state.cities = [];
        state.notFound = [];
        state.failed = [];
        state.error = action.payload ?? 'Could not load weather, please try again.';
      });
  },
});

export const { setQuery } = weatherSlice.actions;

export const selectQuery = (state: RootState) => state.weather.query;
export const selectCities = (state: RootState) => state.weather.cities;
export const selectNotFound = (state: RootState) => state.weather.notFound;
export const selectFailed = (state: RootState) => state.weather.failed;
export const selectError = (state: RootState) => state.weather.error;
export const selectLoading = (state: RootState) => state.weather.loading;

// On Enter: read the query from the store, split it into cities and fetch them.
export const submitSearch = (): AppThunk => (dispatch, getState) => {
  const names = parseCities(selectQuery(getState()));
  if (names.length > 0) {
    dispatch(fetchWeather(names));
  }
};

export default weatherSlice.reducer;
