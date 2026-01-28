import { makeHttpClient } from "./http.js";

/**
 * Uses Open-Meteo forecast API (no key required) to get current weather.
 * Docs: https://open-meteo.com/en/docs
 */
export async function fetchCurrentWeather({ latitude, longitude, timezone = "Europe/Tirane" }) {
  const http = makeHttpClient();
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
    timezone
  };

  const res = await http.get(url, { params });
  const current = res?.data?.current;
  if (!current) return null;

  return {
    time: current.time,
    temperature_2m: current.temperature_2m,
    relative_humidity_2m: current.relative_humidity_2m,
    wind_speed_10m: current.wind_speed_10m
  };
}
