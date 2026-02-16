import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

function getKey() {
  const b64 = process.env.ENC_KEY_BASE64;
  if (!b64) throw new Error("Missing ENC_KEY_BASE64 in .env");
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) throw new Error("ENC_KEY_BASE64 must decode to 32 bytes (AES-256 key).");
  return key;
}

// encrypt Buffer -> JSON payload (base64 fields)
export function encryptBuffer(plainBuf) {
  const key = getKey();
  const iv = crypto.randomBytes(12); // recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([cipher.update(plainBuf), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    alg: "aes-256-gcm",
    iv_b64: iv.toString("base64"),
    tag_b64: tag.toString("base64"),
    data_b64: ciphertext.toString("base64")
  };
}

export function decryptPayload(payload) {
  const key = getKey();
  const iv = Buffer.from(payload.iv_b64, "base64");
  const tag = Buffer.from(payload.tag_b64, "base64");
  const data = Buffer.from(payload.data_b64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}
