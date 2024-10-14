const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schemas/userSchema");
const quoteSchema = require("../../schemas/qoutesSchema");
const ratingSchema = require("../../schemas/ratingSchema");
const tips = require("../../tip.json");
const badges = require("../../badges.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Display a user's quote profile with detailed statistics.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to display the profile for")
        .setRequired(false)
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const user = interaction.options.getUser("user") || interaction.user;
      let userData = await userSchema.findOne({ userID: user.id });

      if (!userData) {
        userData = new userSchema({
          userID: user.id,
          numberOfQuotes: 0,
          TotalRatings: 0,
          streaks: 0,
          AuthorizedStaff: false,
          DmAuthorized: true,
          Badges: [],
          Progress: 0,
        });
        await userData.save();
      }

      // Get all ratings for the user
      const userRatings = await ratingSchema.find({ userID: user.id });

      // Calculate total ratings and average rating
      const totalRatings = userRatings.length;
      const avgRating =
        totalRatings > 0
          ? (
              userRatings.reduce((sum, rating) => sum + rating.rating, 0) /
              totalRatings
            ).toFixed(2)
          : "N/A";

      // Get latest quote
      const latestQuote = await quoteSchema
        .findOne({ userID: user.id })
        .sort({ createdAt: -1 });

      // Get top-rated quote
      const topRatedQuote = await quoteSchema
        .findOne({ userID: user.id })
        .sort({ rating: -1 });

      // Get ratings for latest and top-rated quotes
      let latestQuoteRating = "Not rated yet";
      let topRatedQuoteRating = "Not rated yet";

      if (latestQuote) {
        const latestRating = userRatings.find(
          (rating) => rating.quoteID === latestQuote.quoteID
        );
        if (latestRating) {
          latestQuoteRating = `${latestRating.rating.toFixed(1)} / 5.0`;
        }
      }

      if (topRatedQuote) {
        const topRating = userRatings.find(
          (rating) => rating.quoteID === topRatedQuote.quoteID
        );
        if (topRating) {
          topRatedQuoteRating = `${topRating.rating.toFixed(1)} / 5.0`;
        }
      }

      const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

      const badgeEmojis = userData.Badges.map((badgeName) => {
        const badge = badges.badges.find((b) => b.name === badgeName);
        return badge ? badge.emoji : "";
      }).join(" ");

      const profileEmbed = new EmbedBuilder()
        .setColor("#4A5EAD")
        .setTitle(`📚 ${user.username}'s Quotation Odyssey 📚`)
        .setDescription(
          `*"Weaving wisdom through words, one quote at a time."*`
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          {
            name: "📊 Quote Statistics",
            value:
              `> 📜 **Quotes Contributed:** ${userData.numberOfQuotes}\n` +
              `> ⭐ **Total Ratings Received:** ${totalRatings}\n` +
              `> 📈 **Average Rating:** ${avgRating} / 5.0\n` +
              `> 🔥 **Current Streak:** ${userData.streaks} days\n` +
              `> 🏅 **Ranking:** #${await getUserRanking(user.id)} overall`,
            inline: false,
          },
          {
            name: "🏆 Achievements Unlocked",
            value:
              badgeEmojis.length > 0
                ? `> ${badgeEmojis}`
                : "> No badges earned yet. Your journey awaits!",
            inline: false,
          },
          {
            name: "🌟 Latest Inspiration",
            value: latestQuote
              ? `> "*${
                  latestQuote.quoteName
                }*"\n> 📅 Shared on ${latestQuote.createdAt.toDateString()}\n> 🌠 Rating: ${latestQuoteRating}`
              : "No quotes added yet. Start your quotation journey!",
            inline: false,
          },
          {
            name: "🏆 Most Acclaimed Quote",
            value: topRatedQuote
              ? `> "*${topRatedQuote.quoteName}*"\n> 🌠 Rating: ${topRatedQuoteRating}`
              : "Add more quotes to see your top-rated inspiration!",
            inline: false,
          },
          {
            name: "📈 Progress",
            value: generateProgressBar(userData.numberOfQuotes),
            inline: false,
          }
        )
        .setFooter({
          text: `💡 Tip: ${randomTip}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [profileEmbed], ephemeral: false });
    } catch (err) {
      console.error("[ERROR] Error in the profile command run function:", err);
      await interaction.reply({
        content:
          "An error occurred while crafting your quotation profile. Please try again later.",
        ephemeral: true,
      });
    }
  },
};

async function getUserRanking(userId) {
  const allUsers = await userSchema.find().sort({ numberOfQuotes: -1 });
  const userIndex = allUsers.findIndex((user) => user.userID === userId);
  return userIndex + 1;
}

function generateProgressBar(current) {
  const level = Math.floor(current / 100);
  const max = 100 + level * 400;
  const currentInLevel = current % max;
  const percentage = Math.min((currentInLevel / max) * 100, 100);
  const filledWidth = Math.floor(currentInLevel / 10);
  const emptyWidth = 10 - filledWidth;

  const filledBar = "🟦".repeat(current);
  const emptyBar = "🟥".repeat(Math.max(0, 10 - current));

  return `${filledBar}${emptyBar} ${percentage.toFixed(1)}%\n*Level ${
    level + 1
  } - ${currentInLevel}/${max} quotes to next level*`;
}
