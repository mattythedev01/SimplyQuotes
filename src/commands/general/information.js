const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tips = require("../../tip.json"); // Import the tips.json file

module.exports = {
  data: new SlashCommandBuilder()
    .setName("information")
    .setDescription("Provides instructions on how to use the quote system.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];
      const infoEmbed = new EmbedBuilder()
        .setColor("#0099ff") // Blue color
        .setTitle("How to Use the Quote System")
        .setDescription(
          "To add a quote to our database, use the command `/add-quote <category> <quote>`. Once added, your quote may be selected to be sent globally to all designated quote channels every 24 hours."
        )
        .setFooter({
          text: `Tip: ${randomTip}`, // Use the random tip in the footer
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [infoEmbed], ephemeral: false });
    } catch (err) {
      console.error(
        "[ERROR] Error in the information command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
