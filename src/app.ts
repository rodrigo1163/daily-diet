import { fastify } from "fastify";
import { env } from "@/env";
import { createUser, listUsers } from "./routes/users";
import cookie from '@fastify/cookie'
import { createMeal, deleteMeal, getMeal, listMeals, updateMeal } from "./routes/meals";

export const app = fastify();

app.register(cookie)

app.register(createUser);
app.register(listUsers);

app.register(createMeal)
app.register(updateMeal)
app.register(listMeals)
app.register(getMeal)
app.register(deleteMeal)

