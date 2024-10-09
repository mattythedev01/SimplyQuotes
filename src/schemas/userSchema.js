const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userID: String,
  quoteID: String, // Added quoteID as per instruction
  category: String,
  quoteName: String,
  numberOfQuotes: Number,
  createdAt: Date,
  rating: Number,
  streaks: Number, // Added streaks to track consecutive correct trivia or quote categorizations
});

module.exports = model("User", userSchema);
