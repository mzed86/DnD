import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { config } from "./config.js";
import { sessionRoute } from "./routes/session.js";

const server = Fastify({ logger: true });

await server.register(cors, { origin: true });
await server.register(websocket);

server.get("/health", async () => {
  return { status: "ok", npc: "Mira Ashvane" };
});

await server.register(sessionRoute);

try {
  await server.listen({ port: config.port, host: "0.0.0.0" });
  console.log(`Server running on http://localhost:${config.port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
