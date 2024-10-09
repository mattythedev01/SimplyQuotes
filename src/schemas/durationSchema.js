const { Schema, model } = require("mongoose");

const durationSchema = new Schema({
  guildID: String,
  Time: {
    hours: Number,
    minutes: Number,
    seconds: Number,
  },
});

module.exports = model("Duration", durationSchema);
