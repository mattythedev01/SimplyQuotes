const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schemas/userSchema");
const quoteSchema = require("../../schemas/qoutesSchema");
const ratingSchema = require("../../schemas/ratingSchema");
const tips = require("../../tip.json");
const badges = require("../../badges.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Display a user's profile.")
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
        });
        await userData.save();
      }

      // Get total ratings for the user
      const totalRatings = await ratingSchema.countDocuments({
        userID: user.id,
      });

      let lastQuote = "No quotes added yet";
      let lastQuoteRating = "N/A";
      let lastQuoteDate = "";
      const latestQuote = await quoteSchema
        .findOne({ userID: user.id })
        .sort({ createdAt: -1 });
      if (latestQuote) {
        lastQuote = latestQuote.quoteName;
        lastQuoteRating = latestQuote.rating
          ? `${latestQuote.rating.toFixed(1)} / 5.0`
          : "Not rated yet";
        lastQuoteDate = latestQuote.createdAt.toDateString();
      }

      const randomTip = tips[Math.floor(Math.random() * tips.length)];

      const badgeEmojis = userData.Badges.map((badgeName) => {
        const badge = badges.badges.find((b) => b.name === badgeName);
        return badge ? badge.emoji : "";
      }).join(" ");

      const profileEmbed = new EmbedBuilder()
        .setColor("#4A5EAD")
        .setTitle(`${user.username}'s Quote Profile`)
        .setDescription(`*"Inspiring others, one quote at a time."*`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          {
            name: "📊 Quote Stats",
            value:
              `> 📜 **Quotes Submitted:** ${userData.numberOfQuotes}\n` +
              `> ⭐ **Total Ratings:** ${totalRatings}\n` +
              `> 🔥 **Current Streak:** ${userData.streaks} days`,
            inline: false,
          },
          {
            name: "🏆 Badges",
            value:
              badgeEmojis.length > 0
                ? badgeEmojis
                : "No badges earned yet. Keep quoting!",
            inline: false,
          },
          {
            name: "🌟 Latest Quote",
            value: `> "${lastQuote}"`,
            inline: false,
          }
        )
        .setFooter({
          text: `Tip: ${randomTip}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [profileEmbed], ephemeral: false });
    } catch (err) {
      console.error("[ERROR] Error in the profile command run function:", err);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
