const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const prodSchema = new mongoose.Schema({});
const UserModel = mongoose.model("Customers", UserSchema);
module.exports = UserModel;
