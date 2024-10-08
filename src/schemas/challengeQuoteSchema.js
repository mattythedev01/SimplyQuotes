const { Schema, model } = require("mongoose");

const challengeQuoteSchema = new Schema({
  userID: String,
  challengeQuoteName: String,
  isActive: Boolean, // Indicates if the challenge is active or not
  prize: String, // Description or name of the prize for winning the challenge
});

module.exports = model("ChallengeQuote", challengeQuoteSchema);
