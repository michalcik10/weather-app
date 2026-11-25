// One item of the OpenWeatherMap Geocoding API response (geo/1.0/direct)
export type GeoLocation = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};
