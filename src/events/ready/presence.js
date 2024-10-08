const { ActivityType } = require("discord.js");
const User = require("../../schemas/userSchema"); // Import User schema to access the database

module.exports = async (client) => {
  /**
   * @param {Client} client
   */
  const users = await User.find({});
  const totalQuotes = users.length; // Total number of quotes in the database

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
