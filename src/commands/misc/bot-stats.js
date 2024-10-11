const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const quoteSchema = require("../../schemas/qoutesSchema"); // Updated to use quoteSchema
const defaultQuotes = require("../../defaultQuotes.json"); // Path to defaultQuotes.json
const tips = require("../../tip.json"); // Import the tips.json file

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-stats")
    .setDescription("Get statistics about the bot")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const totalGuilds = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const totalQuotes = await quoteSchema.countDocuments(); // Updated to use quoteSchema
    const totalDefaultQuotes = defaultQuotes.length; // Get the total number of default quotes
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const statsEmbed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("🤖 Bot Statistics 📊")
      .setDescription("Here's a quick glance at some cool stats")
      .addFields(
        { name: "🏠 Guilds", value: `${totalGuilds}`, inline: true },
        { name: "👥 Members", value: `${totalMembers}`, inline: true },
        { name: "💬 Community Quotes", value: `${totalQuotes}`, inline: true },
        {
          name: "📜 Default Quotes",
          value: `${totalDefaultQuotes}`,
          inline: true,
        }
      )
      .setFooter({
        text: `Tip: ${randomTip}`, // Use the random tip in the footer
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [statsEmbed],
      ephemeral: false,
    });
  },
};
