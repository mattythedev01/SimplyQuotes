const { Schema, model } = require("mongoose");

const quoteSchema = new Schema({
  userID: String,
  quoteID: String,
  category: String,
  quoteName: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Quote", quoteSchema);
