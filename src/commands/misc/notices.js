const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const notices = require("../../notices.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notices")
    .setDescription("View current notices about the bot")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const noticeFields = Object.entries(notices).map(([key, value]) => ({
      name: `**${key.toUpperCase().replace(/_/g, " ")}**`,
      value: `${value}`,
      inline: false,
    }));

    const noticeEmbed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle("📢 Current Notices")
      .setDescription(
        "Stay updated with the latest information and alerts about the bot."
      )
      .addFields(noticeFields)
      .setFooter({
        text: `Last updated`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [noticeEmbed],
      ephemeral: false,
    });
  },
};
