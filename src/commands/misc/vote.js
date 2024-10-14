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
    .setName("vote")
    .setDescription(
      "Cast your vote and help SimplyQuote's cosmic library expand!"
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const voteEmbed = new EmbedBuilder()
      .setColor("#8A2BE2") // Vibrant purple for a cosmic feel
      .setTitle("🌟 Illuminate the Cosmos: Vote for SimplyQuote!")
      .setDescription(
        "Your vote is a star in SimplyQuote's expanding universe! Each click fuels our journey through the realms of wisdom and inspiration. Join us in this cosmic adventure!"
      )
      .addFields(
        {
          name: "🚀 Why Vote?",
          value:
            "Every vote propels SimplyQuote further into the galaxy of possibilities, unlocking new features and reaching more stargazers like you!",
          inline: false,
        },
        {
          name: "🎁 Rewards Await!",
          value:
            "Voters may receive exclusive cosmic badges, increased quote limits, and access to secret constellations of knowledge!",
          inline: false,
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({
        text: `💫 Celestial Wisdom: ${randomTip}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Cast Your Vote")
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/1292737804530356224")
        .setEmoji("🗳️"),
      new ButtonBuilder()
        .setLabel("Invite SimplyQuote to Your Realm")
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=1292737804530356224&scope=bot&permissions=2147483647"
        )
        .setEmoji("🌌")
    );

    await interaction.reply({
      embeds: [voteEmbed],
      components: [buttons],
      ephemeral: false,
    });

    // Track voting statistics
    try {
      await client.voteTracker.incrementVoteCount(interaction.user.id);
      console.log(`Vote recorded for user ${interaction.user.id}`);
    } catch (error) {
      console.error("Error tracking vote:", error);
    }
  },
};
