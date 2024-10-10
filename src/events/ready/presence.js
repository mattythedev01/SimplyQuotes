const { ActivityType } = require("discord.js");
const quoteSchema = require("../../schemas/qoutesSchema"); // Import quoteSchema to access the database

module.exports = async (client) => {
  /**
   * @param {Client} client
   */
  const totalQuotes = await quoteSchema.countDocuments(); // Get total number of quotes in the database

  const presence = {
    Activity: {
      Name: `${totalQuotes} quotes!`,
      Type: ActivityType.Playing,
    },
    Status: "online",
  };

  setInterval(() => {
    client.user.setPresence({
      activities: [
        { name: presence.Activity.Name, type: presence.Activity.Type },
      ],
      status: presence.Status,
    });
  }, 15_000);
};
