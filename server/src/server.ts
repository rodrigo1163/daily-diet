import { fastify } from "fastify";
import { env } from "@/env";
import { knex } from "./db/connection";

const app = fastify();

app.get("/health", async (req, res) => {
  const test = await knex("sqlite_schema").select("*")
  return { test: JSON.stringify(test) };
});

app.listen({ port: env.PORT }, () => {
  console.log(`Server is running on port ${env.PORT}`);
})