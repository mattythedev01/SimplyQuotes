const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listauthors")
    .setDescription(
      "Lists all authors in the database by their usernames and IDs."
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    await interaction.reply(
      `This command has changed to \`/lists <type> <page>\``
    );
  },
};
