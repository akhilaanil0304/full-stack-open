const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // 1. Create a user to perform test requests
  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'secretpassword'
  }

  await api.post('/api/users').send(newUser)

  // 2. Login to get a valid authentication token
  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secretpassword' })

  token = result.body.token
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with a valid token', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsInDb = await Blog.find({})
    expect(blogsInDb).toHaveLength(1)
  })

  test('fails with 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Unknown Author',
      url: 'http://example.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsInDb = await Blog.find({})
    expect(blogsInDb).toHaveLength(0)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})