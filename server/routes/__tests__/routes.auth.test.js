/* eslint-disable no-undef */
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import express from 'express'
import router from '../auth'
import request from 'supertest'

let mongod

const app = express()
app.use(express.json())
app.use('/api', router)

//test data
const user = {
  email: 'mojojojo@cartoonnetwork.com',
  password: 'evil',
}

//init MongoMemoryServer
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const connectionUri = mongod.getUri()
  await mongoose.connect(connectionUri)
})

beforeEach(async () => {
  //clear existing data
  await mongoose.connection.db.dropDatabase()

  //create user collection and insert user
  const userCollection = await mongoose.connection.db.createCollection(
    'users-test'
  )
  await userCollection.insertOne(user)
})

it('tests log in ', (done) => {
  const response = request(app)
    .post('/auth/login')
    .send(user)
    .expect(201)
    .end(async (err) => {
      if (err) return done(err)
      //check user logged in?
    })

  expect(response.body.user.email).toEqual(user.email)
  expect(response.body.user.first_name).toEqual(user.first_name)
  expect(response.body.user.last_name).toEqual(user.last_name)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})
