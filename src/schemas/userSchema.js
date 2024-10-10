const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userID: String,
  numberOfQuotes: Number,
  TotalRatings: Number,
  streaks: Number,
  AuthorizedStaff: Boolean,
  DmAuthorized: Boolean,
  Badges: [String],
});

module.exports = model("User", userSchema);
