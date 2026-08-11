import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addBlog = async newBlog => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

const updateBlog = async (id, updatedBlog) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
    return response.data

}

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token },
    }
    await axios.delete(`${baseUrl}/${id}`, config)
}

export default { setToken, getAll, addBlog, updateBlog, deleteBlog }
