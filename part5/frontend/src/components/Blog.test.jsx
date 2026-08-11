import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter as Router } from 'react-router-dom'
import Blog from './Blog'

describe('Blog component', () => {
    let blog
    beforeEach(() => {
        blog = {
            title: 'Test Blog Title',
            author: 'Test Author',
            url: 'http://testurl.com',
            likes: 5,
            user: {
                name: 'Test User',
                username: 'testuser',
            }
        }
    })
    test('renders blog title and author', () => {
        render(
            <Router>
                <Blog blog={blog} />
            </Router>
        )

        screen.getByText('Test Blog Title', { exact: false })
        screen.getByText('Test Author', { exact: false })
        const url = screen.queryByText('http://testurl.com')
        const likes = screen.queryByText('5 likes', { exact: false })
        expect(url).not.toBeInTheDocument()
        expect(likes).not.toBeInTheDocument()
    })

    describe('when unauthenticated', () => {
        test('renders blog url and likes when view button is clicked, like and remove buttons are not displayed', async () => {
            render(
                <Router>
                    <Blog blog={blog} />
                </Router>
            )

            const url = screen.getByText('http://testurl.com')
            const like = screen.getByText('5 likes', { exact: false })

            expect(url).toBeVisible()
            expect(like).toBeVisible()

            const likeButton = screen.queryByRole('button', { name: 'like' })
            const removeButton = screen.queryByRole('button', { name: 'remove' })

            expect(likeButton).not.toBeInTheDocument()
            expect(removeButton).not.toBeInTheDocument()
        })
    })

    describe('when authenticated ', () => {
        describe('and not the blog creator', () => {
            let loggedInUser
            beforeEach(() => {
                loggedInUser = {
                    name: 'Another User',
                    username: 'anotheruser'
                }
            })
            test('can only see like button', async () => {
                render(
                    <Router>
                        <Blog blog={blog} user={loggedInUser} />
                    </Router>
                )

                const likeButton = screen.getByRole('button', { name: 'like' })
                const removeButton = screen.queryByRole('button', { name: 'remove' })

                expect(likeButton).toBeVisible()
                expect(removeButton).not.toBeInTheDocument()
            })

            test('clicking like button twice, the event handler is called twice', async () => {
                const updateBlog = vi.fn()
                render(
                    <Router>
                        <Blog blog={blog} user={loggedInUser} updateBlog={updateBlog} />
                    </Router>
                )

                const user = userEvent.setup()

                const likeButton = screen.getByRole('button', { name: 'like' })
                await user.click(likeButton)
                await user.click(likeButton)

                expect(updateBlog.mock.calls).toHaveLength(2)
            })
        })

        test('authenticated user who is the blog creator can see like and remove buttons', async () => {
            const loggedInUser = {
                name: 'Test User',
                username: 'testuser',
            }

            render(
                <Router>
                    <Blog blog={blog} user={loggedInUser} />
                </Router>
            )

            const likeButton = screen.getByRole('button', { name: 'like' })
            const removeButton = screen.getByRole('button', { name: 'remove' })

            expect(likeButton).toBeVisible()
            expect(removeButton).toBeVisible()
        })
    })
})
