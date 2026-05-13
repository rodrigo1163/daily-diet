import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.datetime('meal_datetime')
    table.boolean('is_diet')
    table.string('created_at').defaultTo(knex.fn.now()).notNullable()
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

