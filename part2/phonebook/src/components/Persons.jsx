const Persons = ({ personsToShow, handleDelete }) => (
  <div>
    {personsToShow.map(person => (
      <p key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
      </p>
    ))}
  </div>
)

export default Persons