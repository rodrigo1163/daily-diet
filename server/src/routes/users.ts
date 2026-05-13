import { knex } from "@/db/connection";
import type { FastifyInstance } from "fastify";
import z from "zod";
import { randomUUID } from 'node:crypto'

export async function createUser(app: FastifyInstance) {
  app.post("/user", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.email(),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = createUserBodySchema.parse(request.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

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

