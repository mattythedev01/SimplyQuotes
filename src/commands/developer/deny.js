const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const approveDenySchema = require("../../schemas/approveDenySchema");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote-deny")
    .setDescription("Deny a quote by its ID")
    .addStringOption((option) =>
      option
        .setName("quoteid")
        .setDescription("The ID of the quote to deny")
        .setRequired(true)
    )
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

    const quoteId = interaction.options.getString("quoteid");
    const quoteData = await approveDenySchema.findOne({ quoteId: quoteId });

    if (!quoteData) {
      await interaction.reply({
        content: "No quote found with the provided ID.",
        ephemeral: true,
      });
      return;
    }

    // Delete the quote from the database
    await approveDenySchema.deleteOne({ quoteId: quoteId });
    await interaction.reply({
      content: `Quote with ID: ${quoteId} has been denied and deleted.`,
      ephemeral: true,
    });
  },
};
