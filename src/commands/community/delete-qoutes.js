const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Quote = require("../../schemas/qoutesSchema");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletequotes")
    .setDescription(
      "Delete a specific quote or list your quotes with their IDs."
    )
    .addStringOption((option) =>
      option
        .setName("quoteid")
        .setDescription("The ID of the quote to delete")
        .setRequired(false)
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const quoteID = interaction.options.getString("quoteid");
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    try {
      if (quoteID) {
        // Delete the specified quote
        const result = await Quote.findOneAndDelete({
          quoteID: quoteID,
          userID: interaction.user.id,
        });
        if (result) {
          await interaction.reply({
            content: `Quote with ID ${quoteID} has been deleted.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `No quote found with ID ${quoteID} or you do not have permission to delete it.`,
            ephemeral: true,
          });
        }
      } else {
        // List all quotes by the user
        const userQuotes = await Quote.find({ userID: interaction.user.id });
        if (userQuotes.length === 0) {
          await interaction.reply({
            content: "You have no quotes in the database.",
            ephemeral: true,
          });
          return;
        }

        const quoteList = userQuotes.map((quote, index) => ({
          name: `Quote #${index + 1}`,
          value: `"${quote.quoteName}"\nID: ${quote.quoteID}`,
          inline: false,
        }));

        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("Your Quotes")
          .addFields(quoteList)
          .setFooter({
            text: randomTip,
          })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (err) {
      console.error(
        "[ERROR] Error in the deletequotes command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
