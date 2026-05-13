import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Meal 1',
        description: 'Description 1',
        meal_datetime: '2026-05-13T10:00:00Z',
        is_diet: true,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Breakfast',
        description: 'I had a breakfast with eggs, bacon and toast',
        meal_datetime: '2026-05-13T10:00:00Z',
        is_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: 'I had a lunch with salad, chicken and rice',
        meal_datetime: '2026-05-13T12:00:00Z',
        is_diet: true,
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(mealsResponse.body.meals).toHaveLength(2)

    expect(mealsResponse.body.meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Breakfast',
          description: 'I had a breakfast with eggs, bacon and toast',
          meal_datetime: '2026-05-13T10:00:00Z',
          is_diet: 1,
          created_at: expect.any(String),
          user_id: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Lunch',
          description: 'I had a lunch with salad, chicken and rice',
          meal_datetime: '2026-05-13T12:00:00Z',
          is_diet: 1,
          created_at: expect.any(String),
          user_id: expect.any(String),
        }),
      ])
    )
  })

  it('should be able to update a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: 'I had a lunch with salad, chicken and rice',
        meal_datetime: '2026-05-13T12:00:00Z',
        is_diet: true,
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies ?? [])
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Breakfast',
        description: 'I had a breakfast with eggs, bacon and toast',
        meal_datetime: '2026-05-13T10:00:00Z',
        is_diet: false,
      })
      .expect(200)

    const updatedMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(updatedMealsResponse.body.meals).toHaveLength(1)

    expect(updatedMealsResponse.body.meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: mealId,
          name: 'Breakfast',
          description: 'I had a breakfast with eggs, bacon and toast',
          meal_datetime: '2026-05-13T10:00:00Z',
          is_diet: 0,
          created_at: expect.any(String),
          user_id: expect.any(String),
        }),
      ])
    )
  })

  it('should be able to delete a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: 'I had a lunch with salad, chicken and rice',
        meal_datetime: '2026-05-13T12:00:00Z',
        is_diet: true,
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies ?? [])
      .expect(200)

    const mealId = getMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .expect(204)

  })

  it('should be able to get a meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: 'I had a lunch with salad, chicken and rice',
        meal_datetime: '2026-05-13T12:00:00Z',
        is_diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies ?? [])
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies ?? [])
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        id: mealId,
        name: 'Lunch',
        description: 'I had a lunch with salad, chicken and rice',
        meal_datetime: '2026-05-13T12:00:00Z',
        is_diet: 1,
        created_at: expect.any(String),
        user_id: expect.any(String),
      })
    )
  })
})
