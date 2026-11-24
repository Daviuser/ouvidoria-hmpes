import crypto from "node:crypto";
import fs from "node:fs";
import { generateVAPIDKeys } from "web-push";

const envPath = ".env";
const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const get = (name) => current.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim().replace(/^['"]|['"]$/g, "");
if (get("VAPID_PUBLIC_KEY") && get("VAPID_PRIVATE_KEY") && get("PUSH_ENCRYPTION_KEY")) {
  console.log("As chaves push já estão configuradas; nenhuma chave foi alterada.");
  process.exit(0);
}
const keys = generateVAPIDKeys();
const values = {
  VAPID_PUBLIC_KEY: get("VAPID_PUBLIC_KEY") || keys.publicKey,
  VAPID_PRIVATE_KEY: get("VAPID_PRIVATE_KEY") || keys.privateKey,
  VAPID_SUBJECT: get("VAPID_SUBJECT") || "mailto:ouvidoria@santaluz.ba.gov.br",
  PUSH_ENCRYPTION_KEY: get("PUSH_ENCRYPTION_KEY") || crypto.randomBytes(32).toString("base64"),
};
let updated = current;
for (const [name, value] of Object.entries(values)) {
  const line = `${name}=${value}`;
  const expression = new RegExp(`^${name}=.*$`, "m");
  updated = expression.test(updated) ? updated.replace(expression, line) : `${updated.trimEnd()}\n${line}\n`;
}
fs.writeFileSync(envPath, updated);
console.log("Chaves VAPID e de cifragem foram geradas no .env local. Defina VAPID_SUBJECT como um endereço de contato real antes de publicar.");
