const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const quoteSchema = require("../../schemas/qoutesSchema");
const defaultQuotes = require("../../defaultQuotes.json");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-stats")
    .setDescription("Unveil the cosmic tapestry of our bot's journey")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const totalGuilds = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const totalQuotes = await quoteSchema.countDocuments();
    const totalDefaultQuotes = defaultQuotes.length;
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const statsEmbed = new EmbedBuilder()
      .setColor("#1E90FF")
      .setTitle("Bot Statistics 🚀")
      .setDescription(
        "Embark on a journey through the celestial tapestry of our bot's universe!"
      )
      .addFields(
        {
          name: "🏰 Realms Enlightened",
          value: `\`\`\`${totalGuilds.toLocaleString()}\`\`\``,
          inline: true,
        },
        {
          name: "👥 Starfarers United",
          value: `\`\`\`${totalMembers.toLocaleString()}\`\`\``,
          inline: true,
        },
        {
          name: "💬 Cosmic Whispers",
          value: `\`\`\`${totalQuotes.toLocaleString()}\`\`\``,
          inline: true,
        },
        {
          name: "📜 Primordial Wisdom",
          value: `\`\`\`${totalDefaultQuotes.toLocaleString()}\`\`\``,
          inline: true,
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({
        text: `💫 Astral Insight: ${randomTip}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [statsEmbed],
      ephemeral: false,
    });
  },
};
