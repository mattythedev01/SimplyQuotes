const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/userSchema");
const Rating = require("../../schemas/ratingSchema");
const tips = require("../../tip.json");
const badges = require("../../badges.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quoteleaderboard")
    .setDescription(
      "Unveil the pantheon of quote masters and their celestial ratings."
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const leaderboard = await User.aggregate([
        {
          $lookup: {
            from: "ratings",
            localField: "userID",
            foreignField: "userID",
            as: "ratings",
          },
        },
        {
          $group: {
            _id: "$userID",
            totalQuotes: { $sum: "$numberOfQuotes" },
            totalRatings: { $sum: { $size: "$ratings" } },
            avgRating: { $avg: "$ratings.rating" },
          },
        },
        { $sort: { totalQuotes: -1, avgRating: -1 } },
        { $limit: 10 },
      ]);

      if (leaderboard.length === 0) {
        await interaction.reply({
          content:
            "The cosmic library awaits its first scribes. Be the pioneer!",
          ephemeral: true,
        });
        return;
      }

      const leaderboardWithDetails = await Promise.all(
        leaderboard.map(async (entry, index) => {
          const user = await client.users.fetch(entry._id);
          const userData = await User.findOne({ userID: entry._id });
          const badgeEmojis = userData.Badges.map((badgeName) => {
            const badge = badges.badges.find((b) => b.name === badgeName);
            return badge ? badge.emoji : "";
          }).join(" ");

          return {
            name: `${index + 1}. ${user.username}`,
            value: `Quotes: ${entry.totalQuotes} | Avg Rating: ${
              entry.avgRating ? entry.avgRating.toFixed(2) : "N/A"
            } ⭐\nStreak: ${userData.streaks} 🔥 | Badges: ${
              badgeEmojis || "None yet"
            }`,
            inline: false,
          };
        })
      );

      const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

      const embed = new EmbedBuilder()
        .setColor("#4A5EAD")
        .setTitle("🏆 Quotation Pantheon: Masters of Wisdom 🏆")
        .setDescription(
          "Behold the luminaries whose words light up our cosmic library!"
        )
        .addFields(leaderboardWithDetails)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
        .setFooter({
          text: `💡 Sage Wisdom: ${randomTip}`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
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
        content:
          "The cosmic energies are misaligned. Our sage librarians are working to restore balance. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
