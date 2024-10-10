const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const quoteSchema = require("../../schemas/qoutesSchema");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-quote")
    .setDescription("Remove a quote by its ID")
    .addStringOption((option) =>
      option
        .setName("quoteid")
        .setDescription("The ID of the quote to remove")
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
    const quoteData = await quoteSchema.findOne({ quoteID: quoteId });

    if (!quoteData) {
      await interaction.reply({
        content: "No quote found with the provided ID.",
        ephemeral: true,
      });
      return;
    }

    // Remove the quote from the database
    await quoteSchema.deleteOne({ quoteID: quoteId });

    await interaction.reply({
      content: `Quote with ID: ${quoteId} has been removed from the database.`,
      ephemeral: true,
    });

    // Optionally, notify the user who created the quote
    const user = await client.users.fetch(quoteData.userID);
    if (user) {
      try {
        await user.send(
          `Your quote \`${quoteData.quoteName}\` has been removed from the database.`
        );
      } catch (error) {
        console.log(`Failed to send DM to user ${quoteData.userID}: ${error}`);
      }
    }
  },
};
