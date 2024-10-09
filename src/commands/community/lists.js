const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/userSchema");
const tips = require("../../tip.json"); // Import the tips.json file

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listquotes")
    .setDescription("Lists the top 10 most recent quotes.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const recentQuotes = await User.find().sort({ createdAt: -1 }).limit(10);
      const totalQuotes = await User.countDocuments(); // Count total quotes in the database

      if (recentQuotes.length === 0) {
        await interaction.reply({
          content: "No quotes found in the database.",
          ephemeral: true,
        });
        return;
      }

      const recentDescriptions = await Promise.all(
        recentQuotes.map(async (quote, index) => {
          if (quote.quoteName === "None Yet") return null; // Skip quotes with "None Yet" as quoteName
          const user = await client.users.fetch(quote.userID);
          return `${index + 1}. "${quote.quoteName}" - ${user.username} (${
            quote.userID
          })\n> ||[Quote ID: ${quote.quoteID}]||`;
        })
      );

      const recentFiltered = recentDescriptions.filter(
        (description) => description !== null
      );

      const randomTip = tips[Math.floor(Math.random() * tips.length)]; // Pick a random tip from the tips array

      const recentEmbed = new EmbedBuilder()
        .setColor("#0099ff") // Blue color
        .setTitle("Top 10 Most Recent Quotes")
        .setDescription(recentFiltered.join("\n"))
        .setFooter({
          text: randomTip, // Use the random tip as the footer text
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [recentEmbed],
        ephemeral: false,
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the listquotes command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
