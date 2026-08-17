const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return await response.json()
}

export const create = async (newNote) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
    }
    const response = await fetch(baseUrl, options)
    if (!response.ok) {
        throw new Error('too short anecdote, must have length 5 or more')
    }

    return await response.json()
}

export const update = async (anecdote) => {
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anecdote)
    }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, options)
    if (!response.ok) {
        throw new Error('Failed to update anecdote')
    }

    return await response.json()
}

