import { makeHttpClient } from "./http.js";
//import cheerio from "cheerio";
import { load } from "cheerio";
import fs from "fs/promises";
import path from "path";

function cleanText(s) {
  return (s || "")
    .replace(/\[.*?\]/g, "")      // remove [1], [2] citations
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Scrapes a public Wikipedia page and extracts city/town rows for Albania.
 * Output: data/raw_cities.json
 */
export async function scrapeCitiesFromWikipedia(url, { limit = 30 } = {}) {
  const http = makeHttpClient();
  const res = await http.get(url);
  const $ = load(res.data);
// const $ = cheerio.load(res.data);

  // Wikipedia commonly uses "wikitable sortable" for lists.
  const tables = $("table.wikitable.sortable");
  if (!tables.length) {
    throw new Error("No wikitable sortable tables found. The page structure may have changed.");
  }

  // Take the first big sortable table and read its rows.
  const rows = $(tables[0]).find("tbody > tr").toArray();

  const cities = [];
  for (const row of rows) {
    const cols = $(row).find("td").toArray();
    if (!cols.length) continue;

    // Heuristic: first cell contains the settlement name.
    const name = cleanText($(cols[0]).text());
    if (!name || name.toLowerCase() === "name") continue;

    // Some tables have County/Region in the next columns; keep best-effort fields.
    const county = cols[2] ? cleanText($(cols[2]).text()) : "";
    const type = cols[1] ? cleanText($(cols[1]).text()) : "";

    // Avoid footnote-only rows and duplicates
    if (name.length < 2) continue;
    if (cities.some((c) => c.name === name)) continue;

    cities.push({ name, type, county });
    if (cities.length >= limit) break;
  }

  await fs.mkdir("data", { recursive: true });
  await fs.writeFile(path.join("data", "raw_cities.json"), JSON.stringify(cities, null, 2), "utf-8");

  return cities;
}
