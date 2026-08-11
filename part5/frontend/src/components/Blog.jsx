import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Button } from '@mui/material'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    const navigate = useNavigate()

    const handleLikes = async () => {
        await updateBlog({ ...blog, likes: blog.likes + 1 })
    }

    const handleRemove = async () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            removeBlog(blog)
            navigate('/')
        }
    }

    if (!blog) {
        return null
    }

    const showRemoveButton = user && blog.user && user.username === blog.user.username


    return (
        <Card sx={{ marginTop: 2, padding: 1 }} variant="outlined" >
            <CardContent>
                <Typography variant="h5" component='div' sx={{ fontWeight: 'bold', mb: 2 }}>
                    {blog.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                    by {blog.author}
                </Typography>
                <Typography sx={{ display: 'block', mb: 1.5 }} component='a' href={blog.url} >
                    {blog.url}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1 }} >
                    Added by {blog.user.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>
                        {blog.likes} likes
                    </Typography>
                    {user && (
                        <Button variant="outlined" onClick={handleLikes}>
                            like
                        </Button>
                    )}
                    {showRemoveButton && (
                        <Button variant="outlined" color="error" onClick={handleRemove}>
                            remove
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card >
    )
}

export default Blog
