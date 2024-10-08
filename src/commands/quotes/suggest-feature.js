const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest-feature")
    .setDescription("Suggest a new feature for the bot")
    .addStringOption((option) =>
      option
        .setName("feature")
        .setDescription("The name of the feature to suggest")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const feature = interaction.options.getString("feature");
    const suggestionChannelId = "1289757252789731328";
    const channel = await client.channels.fetch(suggestionChannelId);

    const embed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("New Feature Suggestion")
      .setDescription(`A new feature has been suggested: **${feature}**`)
      .setFooter({
        text: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({
      content: "Your feature suggestion has been sent!",
      ephemeral: true,
    });
  },
};
