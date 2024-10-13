const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userID: String,
  numberOfQuotes: Number,
  TotalRatings: Number,
  streaks: Number,
  AuthorizedStaff: Boolean,
  DmAuthorized: Boolean,
  Authorized: Boolean,
  Badges: [String],
  Progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

module.exports = model("User", userSchema);
