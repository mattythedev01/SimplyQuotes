const { Schema, model } = require("mongoose");

const lastQuoteSchema = new Schema({
  guildID: String,
  lastSentQuote: {
    type: Date,
    default: () => new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
});

module.exports = model("LastQuote", lastQuoteSchema);
