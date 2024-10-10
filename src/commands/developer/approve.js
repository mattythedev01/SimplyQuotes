const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const approveDenySchema = require("../../schemas/approveDenySchema");
const quoteSchema = require("../../schemas/qoutesSchema");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote-approve")
    .setDescription("Approve a quote by its ID")
    .addStringOption((option) =>
      option
        .setName("quoteid")
        .setDescription("The ID of the quote to approve")
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

    // Mark the quote as approved in approveDenySchema
    quoteData.approved = true;
    quoteData.approvedAt = new Date();
    await quoteData.save();

    // Create a new entry in the quoteSchema for the approved quote
    const newQuoteEntry = new quoteSchema({
      userID: quoteData.userId,
      quoteID: quoteData.quoteId,
      category: quoteData.category,
      quoteName: quoteData.quoteName,
      rating: 0,
    });

    await newQuoteEntry.save();

    // Send a DM to the user who created the quote
    const user = await client.users.fetch(quoteData.userId);
    if (user) {
      try {
        await user.send(
          `Your quote \`${quoteData.quoteName}\` has been approved and is now visible globally.`
        );
      } catch (error) {
        console.log(`Failed to send DM to user ${quoteData.userId}: ${error}`);
      }
    }

    await interaction.reply({
      content: `Quote with ID: ${quoteId} has been approved and the user has been notified.`,
      ephemeral: true,
    });

    // Schedule deletion of the approved quote from approveDenySchema after 5 hours
    setTimeout(async () => {
      await approveDenySchema.deleteOne({ quoteId: quoteId });
    }, 5 * 60 * 60 * 1000); // 5 hours in milliseconds
  },
};
