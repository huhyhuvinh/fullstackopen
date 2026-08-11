import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const navigate = useNavigate()

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({ title, author, url })
        navigate('/')
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    <TextField
                        label='title'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        sx={{ width: 300 }}
                        margin='dense'
                    />
                </div>
                <div>
                    <TextField
                        label='author'
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                        sx={{ width: 300 }}
                        margin='dense'
                    />
                </div>
                <div>
                    <TextField
                        label='url'
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                        sx={{ width: 300 }}
                        margin='dense'
                    />
                </div>
                <Button type="submit" variant="contained" style={{ marginTop: 10 }}>create</Button>
            </form>
        </div>
    )
}

export default BlogForm
