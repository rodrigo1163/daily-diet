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
      created_at: string
      updated_at: string
      session_id: string
    },
    meals: {
      id: string
      name: string
      description: string
      meal_datetime: string
      is_diet: Boolean
      created_at: string
      user_id: string
    }
  }
}