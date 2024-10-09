const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schemas/userSchema"); // Assuming this schema contains quote information

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-quote")
    .setDescription("Report a quote that you think is inappropriate")
    .addStringOption((option) =>
      option
        .setName("quoteid")
        .setDescription("The ID of the quote to report")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const quoteId = interaction.options.getString("quoteid");
    const quoteReportChannelId = "1290152806916821102"; // Assuming this is the channel ID for quote reports
    const channel = await client.channels.fetch(quoteReportChannelId);
    const quoteData = await userSchema.findOne({ quoteId: quoteId });

    if (!quoteData) {
      await interaction.reply({
        content: "No quote found with the provided ID.",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor("#FF0000") // Red color to highlight the report
      .setTitle("Quote Report")
      .setDescription(
        `Quote ID: **${quoteId}** reported by **${interaction.user.tag}**\nQuote: **${quoteData.quoteName}**`
      )
      .setFooter({
        text: `Reported by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({
      content: "Your quote report has been submitted successfully!",
      ephemeral: true,
    });
  },
};
