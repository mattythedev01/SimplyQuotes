const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const quoteChallengeSetupSchema = require("../../schemas/quoteChallengeSetup");
const challengeCategorySchema = require("../../schemas/challengeCategorySchema"); // Changed to log category in challengeCategorySchema
const config = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("challenge-announce")
    .setDescription(
      "Send a challenge to all active channels regardless of category"
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the challenge")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(0) // No default permissions
    .setDMPermission(false), // Not usable in DMs

  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    // Check if the user is a developer
    if (!config.developersIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    const category = interaction.options.getString("category");

    // Log the category to challengeCategorySchema
    const challengeCategory = new challengeCategorySchema({
      categoryName: category,
    });
    await challengeCategory.save();

    const challenges = await quoteChallengeSetupSchema.find({
      isActive: true,
      challengeQuoteCategory: category,
    });

    const embed = new EmbedBuilder()
      .setTitle("New Challenge from the developers!")
      .setDescription(`${category}`)
      .setColor("DarkAqua")
      .setFooter({
        text: "use /add-quote-challenge to make a quote for this category!",
      });
    for (const challenge of challenges) {
      const channel = await client.channels.fetch(
        challenge.quoteChallengeChannelID
      );
      if (!channel) continue;

      const roleMention = challenge.challengeRoleID
        ? `<@&${challenge.challengeRoleID}>`
        : "";
      await channel.send({
        content: roleMention,
        embeds: [embed],
      });
    }

    await interaction.reply({
      content: "Challenge announcement sent to all active channels.",
      ephemeral: true,
    });
  },
};
