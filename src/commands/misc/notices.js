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
      name: `🔔 ${key.toUpperCase().replace(/_/g, " ")}`,
      value: `> ${value}`,
      inline: false,
    }));

    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const noticeEmbed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle("📢 Bulletin Board")
      .setDescription(
        "Greetings, stargazer! 🌟 Tune in to the latest transmissions from across the SimplyQuote universe. These notices are your guide to navigating our ever-expanding galaxy of wisdom!"
      )
      .addFields(noticeFields)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({
        text: `💫 Celestial Wisdom: ${randomTip}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite SimplyQuote")
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/1292737804530356224")
        .setEmoji("🚀"),
      new ButtonBuilder()
        .setLabel("Join Our Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/4zaaRkTPZE")
        .setEmoji("🌠")
    );

    await interaction.reply({
      embeds: [noticeEmbed],
      components: [buttons],
      ephemeral: false,
    });
  },
};
