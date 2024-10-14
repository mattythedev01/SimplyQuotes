const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listbadges")
    .setDescription("List available badges")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    await interaction.reply({
      content: "Command has been moved to `/lists`",
      ephemeral: true,
    });
  },
};
