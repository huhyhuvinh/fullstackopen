const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Test User',
                username: 'testuser',
                password: 'testpassword'
            }
        })
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await page.goto('http://localhost:5173/login')
        await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'testuser', 'testpassword')
            await expect(page.getByText('login successful')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'testuser', 'wrongpassword')
            await expect(page.getByText('wrong username or password')).toBeVisible()
        })

        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await loginWith(page, 'testuser', 'testpassword')
            })
            test('a new blog can be created', async ({ page }) => {
                await createBlog(page, 'test title', 'test author', 'http://testblog.com')
                await expect(page.getByText('test title test author')).toBeVisible()
            })
            describe('and a blog exists', () => {
                beforeEach(async ({ page }) => {
                    await createBlog(page, 'test title', 'test author', 'http://testblog.com')
                })
                test('a blog can be liked', async ({ page }) => {
                    await page.getByText('test title test author').click()
                    await page.getByRole('button', { name: 'like' }).click()

                    await expect(page.getByText('1 likes')).toBeVisible()
                })
                test('a blog can be removed by the user who created it', async ({ page }) => {
                    await page.getByText('test title test author').click()
                    page.on('dialog', dialog => dialog.accept())
                    await page.getByRole('button', { name: 'remove' }).click()
                    await expect(page.getByText('Successfully removed blog test title by test author')).toBeVisible()
                })
                test('the user who created a blog can see the remove button', async ({ page, request }) => {
                    await request.post('http://localhost:3003/api/users', {
                        data: {
                            name: 'Another User',
                            username: 'anotheruser',
                            password: 'anotherpassword'
                        }
                    })
                    await page.getByRole('button', { name: 'logout' }).click()
                    await loginWith(page, 'anotheruser', 'anotherpassword')
                    await page.getByText('test title test author').click()
                    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
                })
            })
            describe('and multiple blogs exist', () => {
                test('blogs are ordered according to likes', async ({ page }) => {
                    await createBlog(page, 'first blog', 'author1', 'http://firstblog.com')
                    await createBlog(page, 'second blog', 'author2', 'http://secondblog.com')

                    const firstBlogElement = page.getByText('first blog author1').locator('..')
                    const secondBlogElement = page.getByText('second blog author2').locator('..')

                    await firstBlogElement.getByRole('button', { name: 'view' }).click()
                    await firstBlogElement.getByRole('button', { name: 'like' }).click()
                    await firstBlogElement.getByText('likes 1').waitFor()

                    await secondBlogElement.getByRole('button', { name: 'view' }).click()
                    await secondBlogElement.getByRole('button', { name: 'like' }).click()
                    await secondBlogElement.getByText('likes 1').waitFor()
                    await secondBlogElement.getByRole('button', { name: 'like' }).click()
                    await secondBlogElement.getByText('likes 2').waitFor()

                    const blogElements = page.locator('.blog')
                    await expect(blogElements).toHaveCount(2)
                    await expect(blogElements.first()).toContainText('second blog author2')
                    await expect(blogElements.last()).toContainText('first blog author1')
                })
            })
        })
    })
})
