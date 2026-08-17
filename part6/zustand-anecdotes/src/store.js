import { useShallow } from 'zustand/react/shallow'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create(devtools((set, get) => ({
    anecdotes: [],
    filter: '',
    actions: {
        add: async (content) => {
            const newAnecdote = await anecdoteService.createNew(content)
            set(state => ({
                anecdotes: state.anecdotes.concat(newAnecdote).toSorted((a, b) => b.votes - a.votes)
            }))
        },
        vote: async (id) => {
            const anecdote = get().anecdotes.find(a => a.id === id)
            const updated = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 })
            set(state => ({
                anecdotes: state.anecdotes.map(a => a.id === id ? updated : a).toSorted((a, b) => b.votes - a.votes)
            }))
        },
        setFilter: value => set(() => ({ filter: value })),
        initialize: async () => {
            const anecdotes = await anecdoteService.getAll()
            set(() => ({ anecdotes: anecdotes.toSorted((a, b) => b.votes - a.votes) }))
        },
        remove: async (id) => {
            await anecdoteService.remove(id)
            set(state => ({
                anecdotes: state.anecdotes.filter(a => a.id !== id)
            }))
        }
    },
})))

const useNotificationStore = create((set) => ({
    notification: null,
    actions: {
        setNotification: (notification, second) => {
            set(() => ({ notification }))
            setTimeout(() => {
                set(() => ({ notification: null }))
            }, second * 1000)
        }
    }
}))

export const useAnecdotes = () =>
    useAnecdoteStore(useShallow(({ anecdotes, filter }) =>
        anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
    ))
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export default useAnecdoteStore

export const useNotification = () =>
    useNotificationStore(state => state.notification)

export const useNotificationActions = () =>
    useNotificationStore(state => state.actions)
