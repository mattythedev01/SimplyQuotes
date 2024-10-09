const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildId: String,
  isBlacklisted: { type: Boolean, default: false },
  blacklistedUsers: [String],
});

module.exports = model('Guild', guildSchema);