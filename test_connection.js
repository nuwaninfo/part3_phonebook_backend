const mongoose = require("mongoose");

const url =
  "mongodb+srv://nuwaninfo:fernando45@cluster0.c8xljds.mongodb.net/phonebook?retryWrites=true&w=majority";

mongoose.connect(url);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connecte to db server");
});

// Event listener for connection errors
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
