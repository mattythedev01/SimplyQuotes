const { Schema, model } = require("mongoose");

const challengeCategorySchema = new Schema({
  categoryName: String,
  prize: String,
});

module.exports = model("ChallengeCategory", challengeCategorySchema);
