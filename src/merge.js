import { encryptJsonFile } from "./security/encryptFile.js";
import fs from "fs/promises";
import path from "path";
import { geocodeCity } from "./geocode.js";
import { fetchCurrentWeather } from "./weather.js";
import { sleep } from "./http.js";
import { writeCsv } from "./utils/csv.js";

/**
 * Merges:
 *  - scraped data (city list) + geocoding + current weather
 * Output:
 *  - data/enriched_cities_weather.json
 *  - data/enriched_cities_weather.csv (optional)
 */
export async function enrichCitiesWithWeather({ limit = 30, delayMs = 450, format = "both", cities = null } = {}) {
  await fs.mkdir("data", { recursive: true });

  if (!cities) {
    const rawPath = path.join("data", "raw_cities.json");
    const raw = await fs.readFile(rawPath, "utf-8");
    cities = JSON.parse(raw);
  }

  const selected = cities.slice(0, limit);
  const out = [];

  for (const c of selected) {
    const geo = await geocodeCity(`${c.name}, Albania`);
    // Be gentle with public APIs
    await sleep(delayMs);

    if (!geo) {
      out.push({ ...c, geocode_found: false });
      continue;
    }

    const weather = await fetchCurrentWeather({
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone || "Europe/Tirane"
    });
    await sleep(delayMs);

    out.push({
      ...c,
      geocode_found: true,
      latitude: geo.latitude,
      longitude: geo.longitude,
      country: geo.country,
      admin1: geo.admin1,
      timezone: geo.timezone,
      weather_time: weather?.time ?? null,
      temperature_2m: weather?.temperature_2m ?? null,
      relative_humidity_2m: weather?.relative_humidity_2m ?? null,
      wind_speed_10m: weather?.wind_speed_10m ?? null
    });
  }

  const jsonPath = path.join("data", "enriched_cities_weather.json");
  await fs.writeFile(jsonPath, JSON.stringify(out, null, 2), "utf-8");

  // ✅ ENCRYPT JSON (duhet para return)
  const encPath = await encryptJsonFile(jsonPath);
  console.log(`🔐 Encrypted output written to: ${encPath}`);

  if (format === "csv" || format === "both") {
    const csvPath = path.join("data", "enriched_cities_weather.csv");
    await writeCsv(csvPath, out);
  }
 
  return { count: out.length, jsonPath };
}


