import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import nameService from "./services/entries";

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

const Entry = ({ person, deleteName }) => {
  return (
    <p>
      {person.name} {person.number}
      <span></span> <button onClick={deleteName}> Delete</button>
    </p>
  );
};

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  return <div className={type}> {message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterOn, setFilterOn] = useState(false);
  const [filterTerm, setFilterTerm] = useState("");
  const [addMessage, setAddMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    nameService.getAll().then((allNames) => {
      setPersons(allNames);
    });
  }, []);

  const addEntry = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Do you want to change the number`
        )
      ) {
        const person = persons.find((p) => p.name === newName);
        const url = `http://localhost:3001/persons/${person.id}`;
        const changedPerson = { ...person, number: newNumber };
        axios.put(url, changedPerson).then((response) => {
          setPersons(
            persons.map((person) =>
              person.name !== newName ? person : response.data
            )
          );
        });
        setNewName("");
        setNewNumber("");
      } else {
        setNewName("");
        setNewNumber("");
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      };
      nameService.create(nameObject).then((returnedName) => {
        setPersons(persons.concat(returnedName));
        setNewName("");
        setNewNumber("");
      });
      setAddMessage(`Added ${nameObject.name}`);
      setTimeout(() => {
        setAddMessage(null);
      }, 5000);
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

  const toDeleteName = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      nameService.destroy(id).catch((error) => {
        setErrorMessage(
          `Information of ${person.name} already deleted from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
      setPersons(persons.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={addMessage} type="addNotification" />
      <Notification message={errorMessage} type="errorNotification" />
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
        <Entry
          person={person}
          key={person.name}
          deleteName={() => toDeleteName(person.id)}
        />
      ))}
    </div>
  );
};

export default App;
