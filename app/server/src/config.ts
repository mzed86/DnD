import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load .env from project root
dotenv.config({ path: resolve(__dirname, "../../../.env") });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    console.error(`Copy .env.example to .env and fill in your API keys.`);
    process.exit(1);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3002,
  deepgram: {
    apiKey: requireEnv("DEEPGRAM_API_KEY"),
  },
  anthropic: {
    apiKey: requireEnv("ANTHROPIC_API_KEY"),
  },
  cartesia: {
    apiKey: requireEnv("CARTESIA_API_KEY"),
  },
} as const;
