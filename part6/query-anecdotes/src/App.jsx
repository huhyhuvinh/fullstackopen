import useAnecdotes from './hooks/useAnecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
    const { anecdotes, isPending, isError, handleVote } = useAnecdotes()

    if (isPending) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>
            anecdotes service not available due to problems in server
        </div>
    }

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm />

            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default App
