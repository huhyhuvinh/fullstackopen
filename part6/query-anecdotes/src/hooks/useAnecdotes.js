import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, create, update } from '../requests'
import useNotify from './useNotify'

const useAnecdotes = () => {
    const queryClient = useQueryClient()
    const { showNotification } = useNotify()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAll,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    const addAnecdoteMutation = useMutation({
        mutationFn: create,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(
                ['anecdotes'],
                anecdotes.concat(newAnecdote)
            )
        }
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: update,
        onSuccess: (updatedAnecdote) => {
            const anecdotes = queryClient.getQueryData(['anecdotes'])
            queryClient.setQueryData(
                ['anecdotes'],
                anecdotes.map(
                    a => a.id === updatedAnecdote.id ? updatedAnecdote : a
                )
            )
        }
    })

    return {
        anecdotes: result.data,
        isPending: result.isPending,
        isError: result.isError,
        addAnecdote: (content) => addAnecdoteMutation.mutate(
            { content, votes: 0 },
            {
                onSuccess: (newAnecdote) => showNotification(`created anecdote '${newAnecdote.content}'`),
                onError: (error) => showNotification(error.message)
            }
        ),
        handleVote: (anecdote) => updateAnecdoteMutation.mutate(
            { ...anecdote, votes: anecdote.votes + 1 },
            {
                onSuccess: (updated) => showNotification(`anecdote '${updated.content}' voted`)
            }
        )
    }
}

export default useAnecdotes
