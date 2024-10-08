const { Schema, model } = require("mongoose");

const quoteSetupSchema = new Schema({
  guildID: String,
  channelID: String,
  roleID: String,
  quoteChallengeChannelID: String, // Added new field as per instruction
  quoteOfTheDay: String, // Field to store the quote of the day
});

module.exports = model("QuoteSetup", quoteSetupSchema);
