const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refillBalanceTime: Number,
  posts: [
    {
      content: String,
    },
  ],
}, { versionKey: false });


const prodSchema = new mongoose.Schema({});
const UserModel = mongoose.model("Customers", UserSchema);
module.exports = UserModel;
