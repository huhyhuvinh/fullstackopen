import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Blog from './Blog'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'
import loginService from '../services/login'

const BlogList = ({ blogs }) => {
    // const blogFormRef = useRef()
    //
    // const blogForm = () => {
    //     return (
    //         <Togglable buttonLabel="create new blog" ref={blogFormRef}>
    //             <BlogForm createBlog={handleAddBlog} />
    //         </Togglable>
    //     )
    // }

    return (
        <div>
            <h2>blogs</h2>
            <ul>
                {[...blogs]
                    .sort((a, b) => b.likes - a.likes)
                    .map(blog =>
                        <li key={blog.id}>
                            <Link to={`/${blog.id}`}>{blog.title} {blog.author}</Link>
                        </li>
                    )}
            </ul>
        </div>
    )
}

export default BlogList

