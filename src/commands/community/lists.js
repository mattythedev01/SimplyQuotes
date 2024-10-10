const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Quote = require("../../schemas/qoutesSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listquotes")
    .setDescription("Lists quotes with pagination.")
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Page number to display")
        .setMinValue(1)
    )
    .toJSON(),

  run: async (client, interaction) => {
    try {
      const page = interaction.options.getInteger("page") || 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;

      const totalQuotes = await Quote.countDocuments();
      const totalPages = Math.ceil(totalQuotes / pageSize);

      if (totalQuotes === 0) {
        return interaction.reply({
          content: "No quotes found in the database.",
          ephemeral: true,
        });
      }

      const quotes = await Quote.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      const quoteDescriptions = await Promise.all(
        quotes.map(async (quote, index) => {
          const user = await client.users.fetch(quote.userID);
          return `${skip + index + 1}. "${quote.quoteName}" - ${
            user.username
          }\n> ||[Quote ID: ${quote.quoteID}]||`;
        })
      );

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Quotes (Page ${page}/${totalPages})`)
        .setDescription(quoteDescriptions.join("\n"))
        .setTimestamp();

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages)
      );

      const response = await interaction.reply({
        embeds: [embed],
        components: [buttons],
        ephemeral: false,
        fetchReply: true,
      });

      const collector = response.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        const newPage = i.customId === "next" ? page + 1 : page - 1;
        await module.exports.run(client, {
          ...interaction,
          options: {
            getInteger: () => newPage,
          },
        });
        await i.update({ components: [] });
      });

      collector.on("end", () => {
        interaction.editReply({ components: [] });
      });
    } catch (err) {
      console.error("[ERROR] Error in the listquotes command:", err);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
