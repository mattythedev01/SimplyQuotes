const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const approveDenySchema = require("../../schemas/approveDenySchema");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quotes-approval")
    .setDescription("Lists all quotes pending approval")
    .setDefaultMemberPermissions(0) // No default permissions
    .setDMPermission(false), // Not usable in DMs

  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    // Check if the user is a developer
    if (!config.developersIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    // Fetch all quotes from the database
    const quotes = await approveDenySchema.find({});
    if (!quotes.length) {
      await interaction.reply({
        content: "No quotes are currently pending approval.",
        ephemeral: true,
      });
      return;
    }

    const quoteList = quotes
      .map(
        (quote, index) =>
          `${index + 1}. ${quote.quoteName} (ID: ${quote.quoteId})`
      )
      .join("\n");
    const embed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("Pending Quotes for Approval")
      .setDescription(quoteList);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
