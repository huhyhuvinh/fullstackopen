import { describe, it, beforeEach, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        add: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
    }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
})

it('initializes anecdotes from the service', async () => {
    const anecdotes = [{ id: 1, content: 'Test anecdote', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
        await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(anecdotes)
})

it('sorts anecdotes by votes', async () => {
    const anecdotes = [
        { id: 1, content: 'Anecdote 1', votes: 2 },
        { id: 2, content: 'Anecdote 2', votes: 5 },
        { id: 3, content: 'Anecdote 3', votes: 1 }
    ]
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
        await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(sortedAnecdotes)
})

it('filters anecdotes based on the filter string', async () => {
    const anecdotes = [
        { id: 1, content: 'Anecdote 1', votes: 2 },
        { id: 2, content: 'Anecdote 2', votes: 5 },
        { id: 3, content: 'Another anecdote', votes: 1 }
    ]
    useAnecdoteStore.setState({ anecdotes, filter: 'another' })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[2]])
})

it('vote increases the number of vote', async () => {
    const anecdote = { id: 1, content: 'Anecdote 1', votes: 2 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue({
        ...anecdote, votes: anecdote.votes + 1
    })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
        await result.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(3)
})
