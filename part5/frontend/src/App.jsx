import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { Container, AppBar, Typography, Toolbar, Button } from '@mui/material'
import blogService from './services/blogs'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    useEffect(() => {
        blogService
            .getAll()
            .then(returnedBlogs => setBlogs(returnedBlogs))
    }, [])

    const match = useMatch('/:id')
    const blog = match ? blogs.find(b => b.id === match.params.id) : null

    const createBlog = async (blogObject) => {
        try {
            // blogFormRef.current.toggleVisibility()
            const blog = await blogService.addBlog(blogObject)
            setBlogs(blogs.concat(blog))
            setMessage({
                type: 'success',
                content: `a new blog ${blog.title} by ${blog.author} added`
            })
        } catch (error) {
            setMessage({
                type: 'error',
                content: error.response.data.error
            })
        }
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const updateBlog = async (blogObject) => {
        try {
            const updatedBlog = await blogService.updateBlog(blogObject.id, blogObject)
            setBlogs(blogs.map(blog => blog.id === blogObject.id ? updatedBlog : blog))
            setMessage({
                type: 'success',
                content: `Successfully updated blog ${updatedBlog.title} by ${updatedBlog.author}`
            })
        } catch (error) {
            setMessage({
                type: 'error',
                content: error.response.data.error
            })
        }
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const removeBlog = async (blog) => {
        try {
            await blogService.deleteBlog(blog.id)
            setBlogs(blogs.filter(b => b.id !== blog.id))
            setMessage({
                type: 'success',
                content: `Successfully removed blog ${blog.title} by ${blog.author}`
            })
        } catch (error) {
            setMessage({
                type: 'error',
                content: error.response.data.error
            })
        }
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        navigate('/')
        setUser(null)
    }

    const padding = {
        padding: 5
    }

    const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

    return (
        <Container>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
                        Blog App
                    </Typography>
                    <Button color='inherit' component={Link} to="/" sx={style}>
                        blogs
                    </Button>
                    {!user && (<Button color='inherit' component={Link} to="/login" sx={style}>
                        login
                    </Button>)}
                    {user && (
                        <div>
                            <Button color='inherit' component={Link} to="/create" sx={style}>
                                create
                            </Button>
                            <Button color='inherit' sx={style} onClick={handleLogout}>
                                logout
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Notification message={message} />
            <Routes>
                <Route path="/:id" element={
                    <Blog
                        blog={blog}
                        user={user}
                        updateBlog={updateBlog}
                        removeBlog={removeBlog}
                    />
                } />
                <Route path="/" element={
                    <BlogList
                        blogs={blogs}
                    />
                } />
                <Route path="/login" element={
                    <LoginForm setUser={setUser} setMessage={setMessage} />
                } />
                <Route path="/create" element={
                    <BlogForm createBlog={createBlog} />
                } />
            </Routes>
        </Container>
    )
}

export default App
