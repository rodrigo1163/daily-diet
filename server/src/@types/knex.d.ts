// eslint-disable-next-line
import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: Date
      updated_at: Date
    },
    meals: {
      id: string
      name: string
      description: string
      meal_datetime: Date
      is_diet: Boolean
      created_at: Date
      user_id: string
    }
  }
}