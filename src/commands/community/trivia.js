const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quotetrivia")
    .setDescription("Add more quotes and this command will come out!")
    .toJSON(),
  run: async (client, interaction) => {
    await interaction.reply({
      content: "Add more quotes and this command will come out!",
      ephemeral: true,
    });
  },
};
