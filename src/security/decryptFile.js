import fs from "fs/promises";
import { decryptPayload } from "./aesGcm.js";

export async function decryptToJson(encPath) {
  const raw = await fs.readFile(encPath, "utf-8");
  const payload = JSON.parse(raw);
  const plainBuf = decryptPayload(payload);
  return plainBuf.toString("utf-8");
}
