import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../store'

const Anecdote = ({ anecdote }) => {
    const { vote, remove } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()
    const handleVote = () => {
        vote(anecdote.id)
        setNotification(`You voted for '${anecdote.content}'`, 5)
    }
    const handleDelete = () => {
        remove(anecdote.id)
        setNotification(`You deleted '${anecdote.content}'`, 5)
    }
    return (
        <div>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
                <button onClick={handleDelete}>delete</button>
            </div>
        </div>
    )
}

export default Anecdote
