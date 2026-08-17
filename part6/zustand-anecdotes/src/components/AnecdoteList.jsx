import { useAnecdotes } from '../store'
import Anecdote from './Anecdote'

const AnecdoteList = () => {
    const anecdotes = useAnecdotes()

    return (
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} />
            )}
        </div>
    )
}

export default AnecdoteList
