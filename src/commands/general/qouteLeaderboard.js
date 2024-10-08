const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quoteleaderboard")
    .setDescription(
      "Displays a leaderboard of users with the most quotes and highest ratings."
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      // Aggregate quotes to count per user, sum ratings, and sort by count and ratings in descending order
      const leaderboard = await User.aggregate([
        {
          $group: {
            _id: "$userID",
            totalQuotes: { $sum: 1 },
            totalRatings: { $sum: "$rating" },
          },
        },
        { $sort: { totalQuotes: -1, totalRatings: -1 } },
        { $limit: 10 }, // Limit to top 10 users
      ]);

      if (leaderboard.length === 0) {
        await interaction.reply({
          content: "No quotes found in the database.",
          ephemeral: true,
        });
        return;
      }

      // Fetch usernames for each user ID in the leaderboard
      const leaderboardWithNames = await Promise.all(
        leaderboard.map(async (entry) => {
          const user = await client.users.fetch(entry._id);
          return `${user.username}: ${entry.totalQuotes} quotes, ${entry.totalRatings} ratings`;
        })
      );

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Quote Leaderboard")
        .setDescription(leaderboardWithNames.join("\n"))
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: false,
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the quoteleaderboard command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
