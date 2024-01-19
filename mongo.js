const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Option 1: Give password as argument to show added phone numbers"
  );
  console.log(
    "Option 2: Give password, name and phone number as arguments to add name and phone number to the database"
  );
}

const [, , password, name, phonenumber] = process.argv;

const url = `mongodb+srv://nuwaninfo:${password}@cluster0.c8xljds.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: phonenumber,
  });

  person.save().then((result) => {
    console.log(`Added ${name} number ${phonenumber}`);
    mongoose.connection.close();
  });
}
