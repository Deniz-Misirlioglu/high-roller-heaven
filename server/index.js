const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const UserModel = require("../server/Models/Customers");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "API HERE"
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

app.post("/postCustomers/:userId", async (req, res) => {

  try {
    const userId = req.params.userId;
    const postData = req.body;

    const user = await UserModel.findById(userId);

    const amount = postData.amount;
    const date = postData.date;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPost = {
      content: postData.content,
    };
    user.balance += amount;

    if (!user.refillBalanceTime) {
      user.refillBalanceTime = date;
    }

    user.posts.push(newPost);

    await user.save();

    res.status(201).json(newPost);

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

app.post("/postCustomers/changeBalance/:userId", async (req, res) => {

  try {
    const userId = req.params.userId;
    const postData = req.body;

    const user = await UserModel.findById(userId);

    const amount = postData.amount;
    const date = postData.date;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPost = {
      content: postData.content,
    };
    user.balance += amount;

    user.refillBalanceTime = date;


    user.posts.push(newPost);

    await user.save();

    res.status(201).json(newPost);

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

app.listen(3001, () => {
  console.log("server is RUNNING");
});
