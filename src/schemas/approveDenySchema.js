const mongoose = require("mongoose");

const approveDenySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  quoteId: {
    type: String,
  },
  quoteName: {
    type: String,
  },
  approve: {
    type: String,
  },
  deny: {
    type: String,
  },
});

module.exports = mongoose.model("ApproveDeny", approveDenySchema);
