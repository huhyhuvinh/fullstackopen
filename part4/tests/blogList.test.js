const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        const blogs = helper.initialBlogs.map(blog => ({ ...blog, user: user._id }))
        await Blog.insertMany(blogs)
        user.blogs = blogs.map(blog => blog._id)
        await user.save()
    })

    test('all blogs are returned', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(helper.initialBlogs.length, response.body.length)
    })

    test('blog posts have id instead of _id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })

    describe('addition of a new blog', () => {
        test('blog can be added', async () => {
            const result = await api
                .post('/api/login')
                .send({ username: 'root', password: 'sekret' })
            const token = result.body.token

            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
            }
            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            const blogsAtEnd = await helper.blogsInDb()
            const content = { ...response.body }
            delete content.id
            delete content.user
            assert('user' in response.body)
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
            assert.deepStrictEqual(content, newBlog)
        })

        test('blog without likes defaults to 0', async () => {
            const result = await api
                .post('/api/login')
                .send({ username: 'root', password: 'sekret' })
            const token = result.body.token

            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            }
            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert('user' in response.body)
            assert.strictEqual(response.body.likes, 0)
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        })

        test('blog without title or url is not added', async () => {
            const result = await api
                .post('/api/login')
                .send({ username: 'root', password: 'sekret' })
            const token = result.body.token
            const newBlog = {
                author: "Robert C. Martin",
            }
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('blog cannot be added without a token', async () => {
            const newBlog = {
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
            }
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deletion and update of a blog', () => {
        test('blog can be deleted', async () => {
            const result = await api
                .post('/api/login')
                .send({ username: 'root', password: 'sekret' })
            const token = result.body.token

            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            const ids = blogsAtEnd.map(b => b.id)
            assert(!ids.includes(blogToDelete.id))
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        })

        test('blog can be updated', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
                .expect(200)
                .expect('Content-Type', /application\/json/)
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
            assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
        })
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "huhyhuvinh",
            name: "vincent",
            password: "123456"
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        const usernames = usersAtEnd.map(u => u.username)
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        assert(usernames.includes(response.body.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'root',
            password: 'secret',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'go',
            password: 'secret',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('shorter than the minimum allowed length'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'huhyhuvinh',
            password: 'se',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('password must be at least 3 characters long'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
