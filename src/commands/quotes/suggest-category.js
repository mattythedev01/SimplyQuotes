const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest-category")
    .setDescription("Suggest a new category for quotes")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The name of the category to suggest")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const category = interaction.options.getString("category");
    const suggestionChannelId = "1289757252789731328";
    const channel = await client.channels.fetch(suggestionChannelId);

    const embed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("New Category Suggestion")
      .setDescription(`A new category has been suggested: **${category}**`)
      .setFooter({
        text: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({
      content: "Your category suggestion has been sent!",
      ephemeral: true,
    });
  },
};
