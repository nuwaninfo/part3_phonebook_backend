const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

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

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("reqbody", function (request, response) {
  return Object.keys(request.body).length !== 0
    ? JSON.stringify(request.body)
    : null;
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :reqbody")
);

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

// Add a person
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  const matchingObjects = persons.filter(
    (obj) => obj["name"].toLowerCase() === body.name.toLowerCase()
  );

  if (matchingObjects.length > 0) {
    return response.status(400).json({ error: "name already exists" });
  }

  const randomId = Math.floor(Math.random() * 10000) + 5;

  const person = {
    id: randomId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
