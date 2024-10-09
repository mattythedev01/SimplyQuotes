const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Get the link to our support server")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)]; // Select a random tip from the tips array
    const supportEmbed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("Support Server")
      .setDescription(
        "Need help? Join our support server: [Support Server](https://discord.gg/4zaaRkTPZE)"
      )
      .setFooter({
        text: `${randomTip}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [supportEmbed],
      ephemeral: true,
    });
  },
};
