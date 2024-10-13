const { ActivityType } = require("discord.js");
const defaultQuotes = require("../../defaultQuotes.json");

module.exports = async (client) => {
  /**
   * @param {Client} client
   */
  const totalDefaultQuotes = defaultQuotes.length;

  const presence = {
    Activity: {
      Name: `${totalDefaultQuotes} quotes!`,
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
