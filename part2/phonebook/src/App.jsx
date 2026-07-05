import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filtered, setFiltered] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        phonebookService
            .getAll()
            .then(initialPersons => { setPersons(initialPersons) })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const existedPerson = persons.find(p => p.name === newName)
        if (existedPerson) {
            const confirmed = confirm(`${existedPerson.name} is already added to phonebook, replace the old number with a new one?`)

            if (confirmed) {
                const updatedPerson = { ...existedPerson, number: newNumber }
                phonebookService
                    .update(updatedPerson.id, updatedPerson)
                    .then(returnedPerson => {
                        setMessage({
                            type: 'success',
                            content: `Updated ${returnedPerson.name}'s number`
                        })
                        setTimeout(() => {
                            setMessage(null)
                        }, 5000)
                        setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p))
                    })
                    .catch(error => {
                        setMessage({
                            type: 'error',
                            content: `Information of ${existedPerson.name} has already been removed from server`
                        })
                        setTimeout(() => {
                            setMessage(null)
                        }, 5000)
                    })
            }

        } else {
            const newPerson = {
                name: newName,
                number: newNumber,
            }
            phonebookService
                .create(newPerson)
                .then(returnedPerson => {
                    setMessage({
                        type: 'success',
                        content: `Added ${returnedPerson.name}`
                    })
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
                    setPersons(persons.concat(returnedPerson))
                })
        }
        setNewName('')
        setNewNumber('')
    }

    const handleNameChange = (e) => {
        setNewName(e.target.value)
    }

    const handleNumberChange = (e) => {
        setNewNumber(e.target.value)
    }

    const handleFilterChange = (e) => {
        setFiltered(e.target.value)
    }

    const handleDelete = (id) => {
        const person = persons.find(p => p.id === id)
        const confirmed = confirm(`delete ${person.name}?`)
        if (confirmed) {
            phonebookService
                .remove(id)
                .then((returnedPerson) => setPersons(
                    persons.filter(p => p.id !== returnedPerson.id)
                ))
        }
    }

    const filteredPersons = filtered
        ? persons.filter(person => person.name.toLowerCase().includes(filtered.toLowerCase()))
        : persons

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} />
            <Filter value={filtered} onChange={handleFilterChange} />
            <h2>Add a new</h2>
            <PersonForm
                onSubmit={handleSubmit}
                name={newName}
                onNameChange={handleNameChange}
                number={newNumber}
                onNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons persons={filteredPersons} handleDelete={handleDelete} />
        </div>
    )
}

export default App
