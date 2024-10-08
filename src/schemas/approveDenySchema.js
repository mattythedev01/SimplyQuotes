const mongoose = require("mongoose");

const approveDenySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  quoteId: {
    type: String,
    required: true,
  },
  quoteName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  denied: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("ApproveDeny", approveDenySchema);
