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
    .setName("support")
    .setDescription("Get assistance and join our vibrant community")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];
    const supportEmbed = new EmbedBuilder()
      .setColor("#FF6B6B")
      .setTitle("📚 SimplyQuotes Support Hub")
      .setDescription(
        "Welcome to the SimplyQuotes community! We're here to help you make the most of your quote-sharing experience."
      )
      .addFields(
        {
          name: "🔧 Need Technical Help?",
          value:
            "Our support team is ready to assist you with any issues or questions.",
          inline: true,
        },
        {
          name: "💡 Share Your Ideas",
          value: "Got suggestions for new features? We'd love to hear them!",
          inline: true,
        },
        {
          name: "🤝 Connect with Quote Enthusiasts",
          value:
            "Join our community to discuss your favorite quotes and meet like-minded individuals.",
          inline: false,
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({
        text: `Tip: ${randomTip}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const supportButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Join Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/4zaaRkTPZE")
        .setEmoji("🚀")
    );

    await interaction.reply({
      embeds: [supportEmbed],
      components: [supportButton],
      ephemeral: false,
    });
  },
};
