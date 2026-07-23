import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterTerm, setFilterTerm] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  // Step 2.11: Fetch initial state from server using useEffect
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const notify = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    // Step 2.7 & 2.15: If duplicate name exists, ask to replace number
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(p => (p.id !== existingPerson.id ? p : returnedPerson))
            )
            setNewName('')
            setNewNumber('')
            notify(`Updated ${returnedPerson.name}'s number`)
          })
          .catch(error => {
            // Step 2.17: Error handling for deleted items
            notify(
              `Information of ${existingPerson.name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    // Step 2.6 & 2.12: Add new person and post to backend
    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      notify(`Added ${returnedPerson.name}`)
    })
  }

  // Step 2.14: Delete entry handler
  const handleDeleteOf = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          notify(`Deleted ${name}`)
        })
        .catch(() => {
          notify(
            `Information of ${name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  // Step 2.9: Filtering logic
  const personsToShow = filterTerm
    ? persons.filter(p => p.name.toLowerCase().includes(filterTerm.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />

      <Filter filterTerm={filterTerm} handleFilterChange={e => setFilterTerm(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={e => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDeleteOf} />
    </div>
  )
}

export default App