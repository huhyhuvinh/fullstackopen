import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ setUser, setMessage }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            navigate('/')
            setMessage({
                type: 'success',
                content: 'login successful'
            })
        } catch {
            setMessage({
                type: 'error',
                content: 'wrong username or password'
            })
        }
        setTimeout(() => {
            setMessage(null)
        }, 5000)
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <TextField
                        label='username'
                        value={username}
                        variant='standard'
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    <TextField
                        label='password'
                        type='password'
                        value={password}
                        variant='standard'
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <div>
                    <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
