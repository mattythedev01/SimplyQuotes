const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Get the link to our support server")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const supportEmbed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("Support Server")
      .setDescription(
        "Need help? Join our support server: [Support Server](https://discord.gg/4zaaRkTPZE)"
      )
      .setFooter({
        text: `We're here to help!`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [supportEmbed],
      ephemeral: true,
    });
  },
};
