import minimist from "minimist";
import { scrapeCitiesFromWikipedia } from "./src/scrapeWikipedia.js";
import { enrichCitiesWithWeather } from "./src/merge.js";

const args = minimist(process.argv.slice(2), {
  string: ["step", "format"],
  default: { step: "all", limit: 30, format: "both", delayMs: 450 }
});

const limit = Number(args.limit) || 30;
const delayMs = Number(args.delayMs) || 450;
const format = String(args.format || "both").toLowerCase();
const step = String(args.step || "all").toLowerCase();

const WIKI_URL = "https://en.wikipedia.org/wiki/List_of_cities_and_towns_in_Albania";

async function main() {
  if (step === "scrape") {
    const cities = await scrapeCitiesFromWikipedia(WIKI_URL, { limit });
    console.log(`✅ Scraped ${cities.length} city rows from Wikipedia.`);
    return;
  }

  if (step === "enrich") {
    // expects data/raw_cities.json exists
    const result = await enrichCitiesWithWeather({ limit, delayMs, format });
    console.log(`✅ Enriched ${result.count} cities with geocoding + current weather.`);
    return;
  }

  // all
  const cities = await scrapeCitiesFromWikipedia(WIKI_URL, { limit });
  const result = await enrichCitiesWithWeather({ limit, delayMs, format, cities });
  console.log(`✅ Done. Enriched ${result.count} cities.`);
}

main().catch((err) => {
  console.error("❌ Error:", err?.message || err);
  process.exit(1);
});
