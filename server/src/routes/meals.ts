import { knex } from "@/db/connection";
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";

export async function createMeal(app: FastifyInstance) {
  app.post("/meals", async (request, reply) => {
    const mealSchema = z.object({
      name: z.string().max(80),
      description: z.string().max(255),
      meal_datetime: z.coerce.date(),
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
    });

    return reply.status(201).send();
  });
}

export async function updateMeal(app: FastifyInstance) {
  app.put("/meals/:id", async (request, reply) => {
    const mealSchema = z.object({
      id: z.string().uuid(),
      name: z.string().max(80),
      description: z.string().max(255),
      meal_datetime: z.coerce.date(),
      is_diet: z.boolean(),
    });

    const { id, name, description, meal_datetime, is_diet } = mealSchema.parse(
      request.body,
    );

    await knex("meals")
      .where("id", id)
      .update({ name, description, meal_datetime, is_diet });

    return reply.send();
  });
}

export async function listMeals(app: FastifyInstance) {
  app.get("/meals", async (request, reply) => {
    const user_id = "123";

    const meals = await knex("meals").where("user_id", user_id).select("*");

    return {
      meals,
    };
  });
}

export async function getMeal(app: FastifyInstance) {
  app.get("/meals/:id", async (request, reply) => {
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
  app.delete("/meals/:id", async (request, reply) => {
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
