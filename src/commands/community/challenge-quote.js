const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const challengeQuoteSchema = require("../../schemas/challengeQuoteSchema");
const challengeCategorySchema = require("../../schemas/challengeCategorySchema");
const mConfig = require("../../messageConfig.json");
const tips = require("../../tip.json"); // Assuming tips are stored in an array in tip.json

module.exports = {
  data: new SlashCommandBuilder()
    .setName("challenge-quote")
    .setDescription("Submit a quote for the current challenge category")
    .addStringOption((option) =>
      option
        .setName("quote")
        .setDescription("The quote to submit for the challenge.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const quote = interaction.options.getString("quote");

    // Check if there is an active challenge category in the database using the categoryName
    const activeCategory = await challengeCategorySchema.findOne({
      categoryName: { $exists: true }, // Check if categoryName exists to determine active challenge
    });
    if (!activeCategory) {
      const rEmbed = new EmbedBuilder()
        .setColor(mConfig.embedColorError)
        .setDescription("❌ No active challenges.")
        .setFooter({
          text: `${client.user.username} - ${
            tips[Math.floor(Math.random() * tips.length)]
          }`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }

    // Create a new challenge quote entry with the submitted quote
    const newChallengeQuote = new challengeQuoteSchema({
      userID: interaction.user.id,
      challengeQuoteName: quote,
      isActive: true,
      prize: activeCategory.prize || "None", // Store the prize directly in the challenge quote, default to "None" if not present
    });
    await newChallengeQuote.save();

    const rEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorSuccess)
      .setDescription(
        `✅ Your quote for the "${activeCategory.categoryName}" challenge has been submitted successfully.`
      )
      .setFooter({
        text: `${client.user.username} - ${
          tips[Math.floor(Math.random() * tips.length)]
        }`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
