const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("consideration")
    .setDescription(
      "Provides a message about the early stage of the bot and its quote database."
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const considerationEmbed = new EmbedBuilder()
        .setColor("#4A5EAD") // A more soothing blue color
        .setTitle("🌱 Early Stage Consideration 🌱")
        .setDescription(
          "This bot is in its early stages, and not many users have added quotes to the database yet. Feel free to contribute and help our collection grow!"
        )
        .setFooter({
          text: `Thank you - SimplyQuote`,
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [considerationEmbed],
        ephemeral: false,
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the consideration command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
