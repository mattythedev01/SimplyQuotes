const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schemas/userSchema");
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("maintenance")
    .setDescription("Set all users' Authorized status to false")
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

    try {
      // Update all users' Authorized field to false
      const result = await userSchema.updateMany(
        {},
        { $set: { Authorized: false } }
      );

      await interaction.reply({
        content: `Maintenance completed. ${result.modifiedCount} users' Authorized status has been set to false.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error during maintenance:", error);
      await interaction.reply({
        content: "An error occurred while setting Authorized status to false.",
        ephemeral: true,
      });
    }
  },
};
