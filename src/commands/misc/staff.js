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
    .setDescription("Learn about becoming an esteemed Quote Reviewer")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];
    const staffEmbed = new EmbedBuilder()
      .setColor("#4CAF50") // A fresh green color
      .setTitle("🎭 Become a Distinguished Quote Reviewer!")
      .setDescription(
        "Embark on a journey to shape the wisdom of our community! As a Quote Reviewer, you'll be the guardian of knowledge, ensuring only the most impactful and inspiring quotes grace our collection."
      )
      .addFields(
        {
          name: "📚 Your Role",
          value:
            "Evaluate and curate the finest quotes from our vibrant community.",
          inline: true,
        },
        {
          name: "🏅 Benefits",
          value:
            "Earn exclusive badges and gain recognition as a pillar of our quote-loving society.",
          inline: true,
        },
        {
          name: "🧠 Requirements",
          value:
            "A passion for literature, an eye for quality, and a dedication to fostering meaningful discussions.",
          inline: false,
        },
        {
          name: "📝 How to Apply",
          value:
            "Join our Support Server and start your journey to become a Quote Reviewer. Our team is excited to welcome new passionate members!",
          inline: false,
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({
        text: `💡 Insightful Tip: ${randomTip}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Join Our Community")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/4zaaRkTPZE")
        .setEmoji("🤝")
    );

    await interaction.reply({
      embeds: [staffEmbed],
      components: [row],
      ephemeral: false,
    });
  },
};
