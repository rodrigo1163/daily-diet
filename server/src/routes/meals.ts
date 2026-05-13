import { knex } from "@/db/connection";
import { checkSessionIdExists } from "@/middlewares/check-session-id-exists";
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";

export async function createMeal(app: FastifyInstance) {
  app.post("/meals", { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const mealSchema = z.object({
      name: z.string().max(80),
      description: z.string().max(255),
      meal_datetime: z.string(),
      is_diet: z.boolean(),
    });

    const { name, description, meal_datetime, is_diet } = mealSchema.parse(
      request.body,
    );

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      meal_datetime,
      is_diet,
      user_id: request.user?.id
    });

    return reply.status(201).send();
  });
}

export async function updateMeal(app: FastifyInstance) {
  app.put("/meals/:id", { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const mealBodySchema = z.object({
      name: z.string().max(80).optional(),
      description: z.string().max(255).optional(),
      meal_datetime: z.string().optional(),
      is_diet: z.boolean().optional(),
    });

    const mealParamsSchema = z.object({
      id: z.string(),
    })

    const body = mealBodySchema.parse(
      request.body,
    );
    const { id } = mealParamsSchema.parse(request.params)

    await knex("meals")
      .where("id", id)
      .update(body);

    return reply.send();
  });
}

export async function listMeals(app: FastifyInstance) {
  app.get("/meals", { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const user_id = "123";

    const meals = await knex("meals").where("user_id", user_id).select("*");

    return {
      meals,
    };
  });
}

export async function getMeal(app: FastifyInstance) {
  app.get("/meals/:id", { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const mealSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = mealSchema.parse(request.params);

    const meal = await knex("meals").where("id", id).select("*");

    return {
      meal,
    };
  });
}

export async function deleteMeal(app: FastifyInstance) {
  app.delete("/meals/:id", { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const mealSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = mealSchema.parse(request.params);

    const meal = await knex("meals").where("id", id).delete().returning("id");

    if (!meal) {
      return reply.status(404).send({
        message: "Refeição não encontrada",
      });
    }

    return reply.status(204).send();
  });
}
