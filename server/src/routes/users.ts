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
    const { name, email } = userSchema.parse(request.body)

    const userExist = await knex('users')
      .where('email', email)
      .select('id')
    
    if (userExist.length > 0) {
      throw new Error('Esse usuário já existe!')
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email
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

