import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls createBlog with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(
        <Router>
            <BlogForm createBlog={createBlog} />
        </Router>
    )
    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testurl.com')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testurl.com'
    })
})
