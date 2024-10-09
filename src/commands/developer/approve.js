const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const approveDenySchema = require("../../schemas/approveDenySchema");
const userSchema = require("../../schemas/userSchema");
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

    // Check if the quote data is older than 24 hours
    const currentTime = new Date();
    const quoteCreationTime = new Date(quoteData.createdAt);
    const timeDifference = currentTime - quoteCreationTime;

    if (timeDifference > 86400000) {
      // 86400000 milliseconds in 24 hours
      await approveDenySchema.deleteOne({ quoteId: quoteId });
      await interaction.reply({
        content:
          "This quote has been in the database for more than 24 hours and has been deleted.",
        ephemeral: true,
      });
      return;
    }

    // Update or create a new entry for approved quotes
    const existingUser = await userSchema.findOne({ userID: quoteData.userId });
    if (existingUser) {
      existingUser.numberOfQuotes += 1; // Increment number of quotes
      await existingUser.save();
    } else {
      await userSchema.create({
        userID: quoteData.userId,
        quoteID: quoteData.quoteId,
        quoteName: quoteData.quoteName,
        category: quoteData.category,
        numberOfQuotes: 1,
        createdAt: new Date(),
        rating: 0, // Initialize rating to 0
      });
    }

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
  },
};
