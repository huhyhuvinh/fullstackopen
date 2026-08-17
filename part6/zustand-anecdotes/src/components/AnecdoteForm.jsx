import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../store'

const AnecdoteForm = () => {
    const { add } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()

    const addAnecdote = e => {
        e.preventDefault()
        const content = e.target.anecdote.value
        add(content)
        setNotification(`You added '${content}'`, 5)
        e.target.reset()
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input type="text" name="anecdote" />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
