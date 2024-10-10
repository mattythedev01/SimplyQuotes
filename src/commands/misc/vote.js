const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for the bot and get an invite link")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const voteEmbed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle("🗳️ Vote for Our Bot")
      .setDescription(
        "Your vote helps us grow! Click the buttons below to vote for our bot or invite it to your server."
      )
      .setFooter({
        text: "Thank you for your support!",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Top.gg")
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/1292737804530356224"),
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=1292737804530356224&scope=bot"
        )
    );

    await interaction.reply({
      embeds: [voteEmbed],
      components: [buttons],
      ephemeral: false,
    });
  },
};
