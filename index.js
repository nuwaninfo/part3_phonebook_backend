const express = require("express");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/info", function (request, response) {
  const numOfPersons = `<p>Phonebook has info for ${persons.length} people</p>`;
  const currentDateTime = `<p>${new Date().toString()}</p>`;
  response.send(numOfPersons + currentDateTime);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Get a singl person information
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).send("person not found").end();
  }
});

// Delete a person
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.use(express.json());

// Add a person
app.post("/api/persons", (request, response) => {
  const body = request.body;

  const randomId = Math.floor(Math.random() * 10000) + 5;

  const person = {
    id: randomId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
