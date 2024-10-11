const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("View the privacy policy for SimplyQuote")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const privacyEmbed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("📜 SimplyQuotes Privacy Policy")
      .setDescription(
        "We are committed to protecting your privacy while providing a global platform for sharing and discovering quotes. Here's our privacy policy:"
      )
      .addFields(
        {
          name: "🌐 Global Data Collection",
          value:
            "We collect user IDs, server IDs, and submitted quotes from users worldwide to operate our global quoting system.",
          inline: false,
        },
        {
          name: "🔒 Data Security",
          value:
            "Your information is stored securely and encrypted. We do not sell or share your data with third parties.",
          inline: false,
        },
        {
          name: "🌍 International Data Transfer",
          value:
            "As a global service, your data may be transferred and processed in countries outside your own.",
          inline: false,
        },
        {
          name: "👤 User Rights",
          value:
            "You can request access, correction, or deletion of your data through our support team, regardless of your location.",
          inline: true,
        },
        {
          name: "🔔 Global Notifications",
          value:
            "Manage your preferences for quote-related notifications across all servers.",
          inline: true,
        },
        {
          name: "📝 Community Guidelines",
          value:
            "Submitted quotes are reviewed to ensure they meet our global community standards.",
          inline: false,
        },
        {
          name: "⏳ Data Retention",
          value:
            "We retain data as required for service operation and comply with various international regulations.",
          inline: true,
        },
        {
          name: "🔄 Policy Updates",
          value:
            "We'll notify users globally of any significant changes to this policy.",
          inline: true,
        }
      )
      .setFooter({
        text: `Protecting Your Privacy | Tip: ${randomTip}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const supportButton = new ButtonBuilder()
      .setLabel("Join Support Server")
      .setURL("https://discord.gg/4zaaRkTPZE")
      .setStyle(ButtonStyle.Link);

    const actionRow = new ActionRowBuilder().addComponents(supportButton);

    await interaction.reply({
      embeds: [privacyEmbed],
      components: [actionRow],
      ephemeral: true,
    });
  },
};
