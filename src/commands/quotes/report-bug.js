const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-bug")
    .setDescription("Report a bug or issue with the bot")
    .addStringOption((option) =>
      option
        .setName("bug")
        .setDescription("Describe the bug or issue you encountered")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const bugDescription = interaction.options.getString("bug");
    const bugReportChannelId = "1290152806916821102"; // Assuming this is the channel ID for bug reports
    const channel = await client.channels.fetch(bugReportChannelId);

    const embed = new EmbedBuilder()
      .setColor("#FF0000") // Red color to highlight the bug report
      .setTitle("Bug Report")
      .setDescription(`A new bug has been reported: **${bugDescription}**`)
      .setFooter({
        text: `Reported by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({
      content: "Your bug report has been submitted successfully!",
      ephemeral: true,
    });
  },
};
