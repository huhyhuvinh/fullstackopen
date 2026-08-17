import { useEffect } from 'react'
import { useAnecdoteActions } from './store'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
    const { initialize } = useAnecdoteActions()
    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <div>
            <h2>Anecdotes</h2>
            <Notification />
            <Filter />
            <AnecdoteList />
            <AnecdoteForm />
        </div>
    )
}

export default App
