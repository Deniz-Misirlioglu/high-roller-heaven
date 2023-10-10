const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const UserModel = require("../server/Models/Customers");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin:37iEoI0TMw6KTHDx@hhh-customers.gjh7k42.mongodb.net/Customers?retryWrites=true&w=majority"
);
//GET CUSTOMERS
app.get("/getCustomers", (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

// POST route to add a new customer
app.post("/addCustomers", (req, res) => {
  const newUser = new UserModel(req.body);
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(err));
});

app.listen(3001, () => {
  console.log("server is runniung");
});
