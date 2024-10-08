const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listquotes")
    .setDescription("Lists the top 10 most recent quotes in the database.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const quotes = await User.find().sort({ createdAt: -1 }).limit(10);
      const totalQuotes = await User.countDocuments(); // Count total quotes in the database
      if (quotes.length === 0) {
        await interaction.reply({
          content: "No quotes found in the database.",
          ephemeral: true,
        });
      } else {
        const quoteDescriptions = await Promise.all(
          quotes.map(async (quote, index) => {
            if (quote.quoteName === "None Yet") return null; // Skip quotes with "None Yet" as quoteName
            const user = await client.users.fetch(quote.userID);
            return `${index + 1}. "${quote.quoteName}" - ${user.username} (${
              quote.userID
            })`;
          })
        );

        const filteredDescriptions = quoteDescriptions.filter(
          (description) => description !== null
        ); // Filter out null descriptions

        if (filteredDescriptions.length === 0) {
          await interaction.reply({
            content: "No valid quotes found in the database.",
            ephemeral: true,
          });
        } else {
          const quotesEmbed = new EmbedBuilder()
            .setColor("#0099ff") // Blue color
            .setTitle("Top 10 Most Recent Quotes")
            .setDescription(filteredDescriptions.join("\n"))
            .setFooter({
              text: `Total Community Quotes: ${totalQuotes}`,
            })
            .setTimestamp();

          await interaction.reply({ embeds: [quotesEmbed], ephemeral: false });
        }
      }
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
