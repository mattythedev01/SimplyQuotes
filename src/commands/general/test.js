const { SlashCommandBuilder } = require("discord.js");
const easydatadb = require("@mattythedev01/easydatadb"); // Adjust the path as necessary

const db = new easydatadb();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Set a value with the user who ran the command")
    .addStringOption((option) =>
      option.setName("key").setDescription("The key to set").setRequired(true)
    ),

  run: async (client, interaction) => {
    const key = interaction.options.getString("key");
    const value = interaction.user.tag; // Get the tag of the user who ran the command
    db.set(key, value);
    await interaction.reply(`Set ${key} to ${value}`);
  },
};
