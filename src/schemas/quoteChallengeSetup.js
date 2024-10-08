const { Schema, model } = require("mongoose");

const quoteChallengeSchema = new Schema({
  guildID: String,
  adminID: String, // ID of the admin who set up or last modified the challenge
  guildOwnerID: String, // ID of the guild owner
  challengeRoleID: String,
  quoteChallengeChannelID: String,
  isActive: Boolean, // Added toggle field to indicate if the challenge is active or not
});

module.exports = model("QuoteChallenge", quoteChallengeSchema);
