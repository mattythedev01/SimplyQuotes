const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userID: String,
  quoteName: String,
  numberOfQuotes: Number,
  category: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
