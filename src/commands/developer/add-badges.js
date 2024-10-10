const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const userSchema = require("../../schemas/userSchema");
const config = require("../../config.json");
const badges = require("../../badges.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-badges")
    .setDescription("Add badges to a user")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("The ID of the user to add badges to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("badge")
        .setDescription("The badge to add")
        .setRequired(true)
        .addChoices(
          ...badges.badges.map((badge) => ({
            name: badge.name,
            value: badge.name,
          }))
        )
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

    const userID = interaction.options.getString("userid");
    const badgeName = interaction.options.getString("badge");

    // Update user in userSchema
    let user = await userSchema.findOne({ userID: userID });
    if (!user) {
      user = new userSchema({
        userID: userID,
        numberOfQuotes: 0,
        TotalRatings: 0,
        streaks: 0,
        AuthorizedStaff: false,
        DmAuthorized: null,
        Badges: [badgeName],
      });
    } else {
      if (!user.Badges.includes(badgeName)) {
        user.Badges.push(badgeName);
      }
    }
    await user.save();

    await interaction.reply({
      content: `Badge "${badgeName}" has been added to user with ID: ${userID}.`,
      ephemeral: true,
    });
  },
};
