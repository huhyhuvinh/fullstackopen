const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'unauthorized' })
    }

    const newBlog = {
        title: title,
        author: author,
        url: url,
        likes: likes || 0,
        user: user._id
    }
    const blog = new Blog(newBlog)

    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'unauthorized' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete a blog' })
    }

    await blog.deleteOne()

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})

module.exports = blogsRouter
