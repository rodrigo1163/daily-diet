import { fastify } from "fastify";
import { env } from "@/env";
import { createUser, listUsers } from "./routes/users";

const app = fastify();

app.register(createUser);
app.register(listUsers);

app.listen({ port: env.PORT }, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
