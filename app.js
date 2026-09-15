const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model("Person", personSchema);


const createAndSavePerson = (done) => {
  const person = new Person({
    name: "John",
    age: 25,
    favoriteFoods: ["pizza", "pasta"]
  });

  person.save()
    .then(data => done(null, data))
    .catch(err => done(err));
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople)
    .then(data => done(null, data))
    .catch(err => done(err));
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName })
    .then(data => done(null, data))
    .catch(err => done(err));
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food })
    .then(data => done(null, data))
    .catch(err => done(err));
};

const findPersonById = (personId, done) => {
  Person.findById(personId)
    .then(data => done(null, data))
    .catch(err => done(err));
};

const addHamburger = (personId, done) => {
  Person.findById(personId)
    .then(person => {
      if (!person) {
        return done(new Error("Person not found"));
      }

      person.favoriteFoods.push("hamburger");

      return person.save();
    })
    .then(updatedPerson => {
      if (updatedPerson) {
        done(null, updatedPerson);
      }
    })
    .catch(err => done(err));
};

const updateAge = (personName, done) => {
  Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true }
  )
    .then(updatedPerson => done(null, updatedPerson))
    .catch(err => done(err));
};

const removeById = (personId, done) => {
  Person.findByIdAndDelete(personId)
    .then(deletedPerson => done(null, deletedPerson))
    .catch(err => done(err));
};

const removeManyPeople = (done) => {
  Person.deleteMany({ name: "Mary" })
    .then(result => done(null, result))
    .catch(err => done(err));
};

const queryChain = (done) => {
  Person.find({ favoriteFoods: "burritos" })
    .sort({ name: 1 })
    .limit(2)
    .select("-age")
    .exec()
    .then(data => done(null, data))
    .catch(err => done(err));
};

module.exports = {
  Person,
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  addHamburger,
  updateAge,
  removeById,
  removeManyPeople,
  queryChain
};
createAndSavePerson((err, data) => {
  if (err) return console.error(err);

  console.log("1. Created person:");
  console.log(data);

  findPeopleByName("John", (err, data) => {
    if (err) return console.error(err);

    console.log("2. Find by name:");
    console.log(data);

    findOneByFood("pizza", (err, data) => {
      if (err) return console.error(err);

      console.log("3. Find by food:");
      console.log(data);
    });
  });
});