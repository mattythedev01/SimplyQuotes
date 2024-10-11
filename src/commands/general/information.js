const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("information")
    .setDescription("Provides instructions on how to use the quote system.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];
      const infoEmbed = new EmbedBuilder()
        .setColor("#FF6B6B") // Vibrant coral color
        .setTitle("📚 Quote System Guide")
        .setDescription(
          "Welcome to our amazing Quote System! Here's how you can contribute and enjoy the wisdom shared by our community."
        )
        .addFields(
          {
            name: "📝 Adding a Quote",
            value:
              "Use `/add-quote <category> <quote>` to contribute your favorite quotes to our database.",
          },
          {
            name: "🌟 Quote Selection",
            value:
              "Your quote might be chosen to inspire others! Selected quotes are shared globally in designated channels every 24 hours.",
          },
          {
            name: "🔍 Categories",
            value:
              "Organize your quotes by category to make them easier to find and appreciate.",
          },
          {
            name: "💡 Benefits",
            value:
              "Share wisdom, inspire others, and be part of a growing collection of thought-provoking quotes!",
          }
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: `Pro Tip: ${randomTip}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [infoEmbed], ephemeral: false });
    } catch (err) {
      console.error(
        "[ERROR] Error in the information command run function:",
        err
      );
      await interaction.reply({
        content:
          "Oops! An error occurred while fetching the information. Please try again later or contact support if the issue persists.",
        ephemeral: true,
      });
    }
  },
};
