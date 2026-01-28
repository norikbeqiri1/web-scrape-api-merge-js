import { makeHttpClient } from "./http.js";

/**
 * Uses Open-Meteo geocoding API (no key required) to get lat/lon for a city name.
 * Docs: https://open-meteo.com/en/docs/geocoding-api
 */
export async function geocodeCity(name) {
  const http = makeHttpClient();
  const url = "https://geocoding-api.open-meteo.com/v1/search";
  const params = {
    name,
    count: 1,
    language: "en",
    format: "json"
  };

  const res = await http.get(url, { params });
  const first = res?.data?.results?.[0];
  if (!first) return null;

  return {
    name: first.name,
    latitude: first.latitude,
    longitude: first.longitude,
    country: first.country,
    admin1: first.admin1,
    timezone: first.timezone
  };
}
