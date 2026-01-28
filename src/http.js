import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export function makeHttpClient() {
  const headers = {};
  if (process.env.USER_AGENT) headers["User-Agent"] = process.env.USER_AGENT;

  return axios.create({
    timeout: 20000,
    headers
  });
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
