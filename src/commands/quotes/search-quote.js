const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/userSchema");
const tips = require("../../tip.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search-quote")
    .setDescription("Search for a quote by name")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the quote to search for")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const quoteName = interaction.options.getString("name");
    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const quote = await User.findOne(
      { "quotes.quoteName": quoteName },
      { "quotes.$": 1 }
    );
    if (!quote || !(quote.quotes && quote.quotes.length > 0)) {
      interaction.reply({
        content: "No quote found with that name.",
        ephemeral: true,
      });
      return;
    }

    const foundQuote = quote.quotes[0];
    const embed = new EmbedBuilder()
      .setTitle(`Quote: "${foundQuote.quoteName}"`)
      .setColor("Blue")
      .addFields({ name: "Quote", value: foundQuote.quoteText, inline: false })
      .setFooter({ text: `Tip: ${randomTip}` });

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
