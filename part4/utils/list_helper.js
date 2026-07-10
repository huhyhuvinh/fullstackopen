const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((maxBlog, blog) => {
        maxBlog.likes = maxBlog.likes || 0
        return (blog.likes > maxBlog.likes) ? blog : maxBlog
    }, {})
}

const mostBlogs = (blogs) => {
    const authorCount = blogs.reduce((authorCount, blog) => {
        authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
        return authorCount
    }, {})
    return Object.entries(authorCount).reduce((maxAuthor, [author, blogs]) => {
        maxAuthor.blogs = maxAuthor.blogs || 0
        return (blogs > maxAuthor.blogs) ? { author, blogs } : maxAuthor
    }, {})
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((authorLikes, blog) => {
        authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
        return authorLikes
    }, {})
    return Object.entries(authorLikes).reduce((maxAuthor, [author, likes]) => {
        maxAuthor.likes = maxAuthor.likes || 0
        return (likes > maxAuthor.likes) ? { author, likes } : maxAuthor
    }, {})
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
