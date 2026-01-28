# Web Scraping + API Integration (JavaScript / Node.js)

This project satisfies the course task requirements:
- Web scraping data from a public website
- Using a public API to enrich the scraped data
- Merging results and exporting to JSON/CSV
- Ready to push to GitHub

## What it does
1. **Scrapes** a public Wikipedia page for a list of Albanian cities/towns.
2. **Calls Open‑Meteo Geocoding API** to get latitude/longitude for each city (no API key needed).
3. **Calls Open‑Meteo Forecast API** to get **current weather** for each location (no API key needed).
4. **Merges** everything and exports:
   - `data/enriched_cities_weather.json`
   - `data/enriched_cities_weather.csv`

> Source scraped: Wikipedia — *List of cities and towns in Albania*  
> APIs used: Open‑Meteo Geocoding + Forecast

---

## Setup
```bash
npm install
cp .env.example .env
```

(Optional) set a user agent in `.env`:
```bash
USER_AGENT=web-scrape-api-merge-js/1.0 (you@example.com)
```

## Run
Run **everything** (scrape + enrich):
```bash
npm run all -- --limit 30 --delayMs 450 --format both
```

Run only scraping:
```bash
npm run scrape -- --limit 50
```

Run only enrichment (requires `data/raw_cities.json`):
```bash
npm run enrich -- --limit 30 --delayMs 450 --format csv
```

### CLI options
- `--limit` number of cities to process (default `30`)
- `--delayMs` delay between API calls (default `450`)
- `--format` `json` | `csv` | `both` (default `both`)
- `--step` `scrape` | `enrich` | `all` (default `all`)

---

## GitHub (push the project)
```bash
git init
git add .
git commit -m "Initial commit: scraping + Open-Meteo API integration"
# create an empty repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/<YOUR-USER>/web-scrape-api-merge-js.git
git push -u origin main
```

---

## Notes
- Public pages can change HTML. If Wikipedia changes the table structure, update the selector in `src/scrapeWikipedia.js`.
- Delays are included to be polite to public APIs.
