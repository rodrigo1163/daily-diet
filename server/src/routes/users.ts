import { knex } from "@/db/connection";
import type { FastifyInstance } from "fastify";
import z from "zod";
import { randomUUID } from 'node:crypto'

const userSchema = z.object({
  name: z.string().max(80),
  email: z.email()
})

export async function createUser(app: FastifyInstance) {
  app.post("/user", async (request, reply) => {
    console.log("cheguei aqui")
    const { name, email } = userSchema.parse(request.body)
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const userExist = await knex('users')
      .where('email', email)
      .orWhere('session_id', sessionId)
      .select('id')

    if (userExist.length === 0) {
      await knex('users').insert({
        id: randomUUID(),
        name,
        email,
        session_id: sessionId,
      })
    }

    return reply.status(201).send()
  });
};

export async function listUsers(app: FastifyInstance) {
  app.get("/users", async () => {
    const users = await knex('users')

    return {
      users
    }
  });
};

