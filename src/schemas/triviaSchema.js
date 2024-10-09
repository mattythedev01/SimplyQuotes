const { Schema, model } = require("mongoose");

const triviaSchema = new Schema({
  userID: String,
  opponentID: String, // Added opponentID to track the opponent in trivia games
  wins: Number,
  losses: Number,
});

module.exports = model("Trivia", triviaSchema);
