const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userID: String,
  quoteID: String, // Added quoteID as per instruction
  quoteName: String,
  numberOfQuotes: Number,
  category: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
