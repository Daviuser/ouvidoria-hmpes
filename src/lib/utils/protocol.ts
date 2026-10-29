import { randomInt } from "node:crypto";

// Alfabeto sem caracteres ambíguos (0/O, 1/I).
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateProtocol(now: Date = new Date()): string {
  let code = "";
  for (let i = 0; i < 8; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `OUV-${now.getUTCFullYear()}-${code}`;
}
