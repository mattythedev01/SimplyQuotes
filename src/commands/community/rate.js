const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ratingSchema = require("../../schemas/ratingSchema");
const Quote = require("../../schemas/qoutesSchema");
const mConfig = require("../../messageConfig.json");
const tips = require("../../tip.json");

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
    const quoteID = interaction.options.getString("quoteid");
    const rating = interaction.options.getInteger("rating");
    const userID = interaction.user.id;
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - SimplyQuote | Tip: ${randomTip}`,
    });

    // Find the quote in the quotes schema
    const quote = await Quote.findOne({ quoteID: quoteID });
    if (!quote) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`❌ Quote not found.`);
      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }

    // Create a new rating entry
    const newRating = new ratingSchema({
      quoteID: quoteID,
      userID: userID,
      rating: rating,
      ratedAt: new Date(),
    });
    await newRating.save();

    // Update the rating in the quotes schema
    await Quote.updateOne({ quoteID: quoteID }, { $inc: { rating: 1 } });

    // Log the rating in the specified channel using an embed
    const logChannel = await client.channels.fetch("1290153108818886688");
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Quote Rating Logged")
        .setDescription(
          `Quote: "${quote.quoteName}"\nRated by: <@${userID}>\nRating: ${rating}/5`
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
