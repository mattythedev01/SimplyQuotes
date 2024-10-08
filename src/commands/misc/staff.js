const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Learn how to become a Quote Reviewer")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const staffEmbed = new EmbedBuilder()
      .setColor("#5865F2") // Changed to a more vibrant Discord blue
      .setTitle("🌟 Become a Quote Reviewer!")
      .setDescription(
        "Are you willing to help out? Join the support server and apply to be a quote reviewer!"
      )
      .setFooter({
        text: "Total Quote Reviewers: 1",
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
