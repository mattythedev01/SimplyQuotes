const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  quoteID: String, // ID of the quote being rated
  userID: String, // ID of the user who rated
  rating: Number, // Rating given to the quote
  ratedAt: { type: Date, default: Date.now }, // Timestamp when the rating was given
});

module.exports = model("Rating", ratingSchema);
