const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const notices = require("../../notices.json");
const tips = require("../../tip.json");

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
      value: `> ${value}`,
      inline: false,
    }));

    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const noticeEmbed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle("📢 Current Notices")
      .setDescription(
        "Stay updated with the latest information and alerts about the bot."
      )
      .addFields(noticeFields)
      .setFooter({
        text: `Tip: ${randomTip}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/1292737804530356224"),
      new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/4zaaRkTPZE")
    );

    await interaction.reply({
      embeds: [noticeEmbed],
      components: [buttons],
      ephemeral: false,
    });
  },
};
