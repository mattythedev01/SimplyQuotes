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
    .setName("hire")
    .setDescription("Hire a user as staff for SimplyQuotes")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("The ID of the user to hire")
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

    const userID = interaction.options.getString("userid");

    // Update user in userSchema
    let user = await userSchema.findOne({ userID: userID });
    if (!user) {
      user = new userSchema({
        userID: userID,
        numberOfQuotes: 0,
        TotalRatings: 0,
        streaks: 0,
        AuthorizedStaff: true,
        DmAuthorized: null,
        Badges: ["Staff"],
      });
    } else {
      user.AuthorizedStaff = true;
      if (!user.Badges.includes("Staff")) {
        user.Badges.push("Staff");
      }
    }
    await user.save();

    // Send a DM to the hired user
    try {
      const hiredUser = await client.users.fetch(userID);
      await hiredUser.send("You have been hired for SimplyQuotes!");

      await interaction.reply({
        content: `User with ID: ${userID} has been hired, given the Staff badge, and notified via DM.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Failed to send DM to user ${userID}: ${error}`);
      await interaction.reply({
        content: `User with ID: ${userID} has been hired and given the Staff badge, but I couldn't send them a DM. They may have DMs disabled.`,
        ephemeral: true,
      });
    }
  },
};
