const { Schema, model } = require("mongoose");

const triviaSchema = new Schema({
  userID: String,
  opponentID: String, // Added opponentID to track the opponent in trivia games
  wins: Number,
  losses: Number,
  rounds: Number, // Added rounds to track the number of rounds played
  matches: Number, // Added matches to track the number of matches played
});

module.exports = model("Trivia", triviaSchema);
