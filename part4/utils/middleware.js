const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token

    if (token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)
        request.user = user
    }

    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        response.status(401).json({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        response.status(401).json({ error: 'token expired' })
    }
    next(error)
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor,
}
