const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Learn how to become a Quote Reviewer")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];
    const staffEmbed = new EmbedBuilder()
      .setColor("#5865F2") // Changed to a more vibrant Discord blue
      .setTitle("🌟 Become a Quote Reviewer!")
      .setDescription(
        "Are you willing to help out? Join the support server and apply to be a quote reviewer!"
      )
      .setFooter({
        text: `Tip: ${randomTip}`,
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Join Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/4zaaRkTPZE")
    );

    await interaction.reply({
      embeds: [staffEmbed],
      components: [row],
      ephemeral: false,
    });
  },
};
