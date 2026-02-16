import fs from "fs/promises";
import path from "path";
import { encryptBuffer } from "./aesGcm.js";

export async function encryptJsonFile(jsonPath) {
  const plain = await fs.readFile(jsonPath);
  const payload = encryptBuffer(plain);

  const outPath = jsonPath + ".enc.json"; // encrypted wrapper
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2), "utf-8");

  return outPath;
}
