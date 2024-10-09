const { Schema, model } = require("mongoose");

const quoteSetupSchema = new Schema({
  guildID: String,
  channelID: String,
  roleID: String,
  quoteChallengeChannelID: String, // Added new field as per instruction
  quoteOfTheDay: String, // Field to store the quote of the day
  lastSentQuote: Date, // Field to store the time of the last sent quote
});

module.exports = model("QuoteSetup", quoteSetupSchema);
