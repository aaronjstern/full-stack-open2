import { useState } from "react";

const Filter = ({ searchEntries }) => {
  return (
    <div>
      Filter entries <input onChange={searchEntries} />
    </div>
  );
};

const PersonForm = ({
  addEntry,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addEntry}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Entry = ({ person }) => {
  return (
    <p>
      {person.name} {person.number}
    </p>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterOn, setFilterOn] = useState(false);
  const [filterTerm, setFilterTerm] = useState("");

  const addEntry = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`);
      setNewName("");
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      };
      setPersons(persons.concat(nameObject));
      setNewName("");
      setNewNumber("");
    }
  };

  const entriesToShow = filterOn
    ? persons.filter((person) =>
        person.name.toLowerCase().startsWith(filterTerm.toLowerCase())
      )
    : persons;

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const searchEntries = (event) => {
    if (event.target.value === "") {
      setFilterOn(false);
    } else {
      setFilterOn(true);
      setFilterTerm(event.target.value);
    }
  };
  return (
    <div>
      <h1>Phonebook</h1>
      <Filter searchEntries={searchEntries} />
      <h2>Add New Entry</h2>
      <PersonForm
        addEntry={addEntry}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {entriesToShow.map((person) => (
        <Entry person={person} key={person.name} />
      ))}
    </div>
  );
};

export default App;
