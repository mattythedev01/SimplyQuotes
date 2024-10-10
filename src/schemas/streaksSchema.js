const { Schema, model } = require("mongoose");

const streaksSchema = new Schema({
  userID: String,
  Streaks: Number,
  StreakLast: Date,
});

module.exports = model("Streak", streaksSchema);
