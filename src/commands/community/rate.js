const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ratingSchema = require("../../schemas/ratingSchema");
const userSchema = require("../../schemas/userSchema");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rate")
    .setDescription("Rate a quote in the system")
    .addStringOption((option) =>
      option
        .setName("quoteid")
        .setDescription("ID of the quote to rate.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("rating")
        .setDescription("Your rating for the quote (1/5, 2/5, 3/5, 4/5, 5/5).")
        .setRequired(true)
        .addChoices(
          { name: "1/5", value: 1 },
          { name: "2/5", value: 2 },
          { name: "3/5", value: 3 },
          { name: "4/5", value: 4 },
          { name: "5/5", value: 5 }
        )
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const quoteId = interaction.options.getString("quoteid");
    const rating = interaction.options.getInteger("rating");
    const userId = interaction.user.id;

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - SimplyQuote`,
    });

    // Find the quote in the user schema
    const quote = await userSchema.findOne({ quoteID: quoteId });
    if (!quote) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`❌ Quote not found.`);
      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }

    // Create a new rating entry
    const newRating = new ratingSchema({
      quoteID: quoteId,
      userID: userId,
      rating: rating,
      ratedAt: new Date(),
    });
    await newRating.save();

    // Update the rating in the user schema
    await userSchema.updateOne({ quoteID: quoteId }, { $inc: { rating: 1 } });

    // Log the rating in the specified channel using an embed
    const logChannel = await client.channels.fetch("1290033222700240987");
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Quote Rating Logged")
        .setDescription(
          `Quote: "${quote.quoteName}"\nRated by: <@${userId}>\nRating: ${rating}/5`
        )
        .setTimestamp();
      logChannel.send({ embeds: [logEmbed] });
    }

    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(`✅ Your rating has been logged.`);
    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
