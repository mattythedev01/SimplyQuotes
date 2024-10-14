const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("information")
    .setDescription("Discover the magic of our Quote System!")
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
        .setColor("#4A5EAD") // Royal blue color
        .setTitle("✨ Embark on Your Quotation Odyssey ✨")
        .setDescription(
          "Welcome, wordsmith, to a realm where wisdom flourishes and inspiration knows no bounds. Prepare to embark on an extraordinary journey through our Quote System!"
        )
        .addFields(
          {
            name: "🖋️ Craft Your Legacy",
            value:
              "```/add-quote <category> <quote>```\nImmortalize your thoughts or share timeless wisdom. Every word you contribute weaves into the tapestry of our collective knowledge.",
          },
          {
            name: "🌠 Shine Among the Stars",
            value:
              "Your quote could be the beacon that guides others! Every 24 hours, we cast a spotlight on select quotes, sharing them across our global network of inspiration seekers.",
          },
          {
            name: "🗂️ Curate Your Collection",
            value:
              "Categories are the constellations in our universe of quotes. Organize your insights to help others navigate the vast expanse of wisdom.",
          },
          {
            name: "🎭 Unlock Your Potential",
            value:
              "• Earn badges and climb the ranks\n• Watch your influence grow with each contribution\n• Inspire and be inspired by a community of thinkers",
          },
          {
            name: "🚀 Begin Your Adventure",
            value:
              "Ready to leave your mark? Start by sharing your first quote and watch as your journey unfolds. The path to wisdom awaits!",
          }
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
        .setFooter({
          text: `💡 Sage Advice: ${randomTip}`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
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
          "Oh no! The cosmic energies seem to be misaligned. Please try again later or seek the wisdom of our support sages if the issue persists.",
        ephemeral: true,
      });
    }
  },
};
