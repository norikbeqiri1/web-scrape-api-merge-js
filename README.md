# Web Scraping + API Integration (JavaScript / Node.js)
**Student:** Norik Beqiri  
**Kursi:** Laborator i Integruar  
**Data:** 16.02.2026  

## Përmbledhje
Ky projekt realizon:
- Web scraping nga një faqe publike (Wikipedia)
- Integrim me API publike (Open-Meteo) për pasurim të të dhënave
- Bashkim (merge) dhe eksport në JSON/CSV
- Enkriptim i output-it final “at rest” me AES-256-GCM

## Çfarë bën
1. Merr listën e qyteteve/qytezave në Shqipëri nga Wikipedia.
2. Përdor Open-Meteo Geocoding API për latitude/longitude (pa API key).
3. Përdor Open-Meteo Forecast API për motin aktual (pa API key).
4. Bashkon të dhënat dhe krijon:
   - `data/enriched_cities_weather.json`
   - `data/enriched_cities_weather.csv`
5. Enkripton JSON-in final dhe krijon:
   - `data/enriched_cities_weather.json.enc.json`

## Setup
```bash
npm install
cp .env.example .env

