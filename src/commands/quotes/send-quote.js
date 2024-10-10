const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schemas/userSchema");
const defaultQuotes = require("../../defaultQuotes.json");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-quote")
    .setDescription("Send a random quote to a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to send the quote to")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const targetUser = interaction.options.getUser("user");

    // Check if the user is trying to send a quote to themselves
    if (targetUser.id === interaction.user.id) {
      const selfSendEmbed = new EmbedBuilder()
        .setColor(mConfig.embedColorError)
        .setDescription("❌ You cannot send a quote to yourself.");

      await interaction.reply({ embeds: [selfSendEmbed], ephemeral: true });
      return;
    }

    // Fetch all quotes from the userSchema
    const allQuotes = await userSchema.find({}, "quoteName");

    let quote;
    if (allQuotes.length > 0) {
      // Select a random quote from the database
      const randomQuote =
        allQuotes[Math.floor(Math.random() * allQuotes.length)];
      quote = randomQuote.quoteName;
    } else {
      // If no quotes in the database, use a default quote
      quote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
    }

    const quoteEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorSuccess)
      .setTitle("Here's an inspiring quote for you!")
      .setDescription(quote)
      .setFooter({
        text: `Sent by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    try {
      await targetUser.send({ embeds: [quoteEmbed] });

      const successEmbed = new EmbedBuilder()
        .setColor(mConfig.embedColorSuccess)
        .setDescription(`✅ Successfully sent a quote to ${targetUser.tag}`);

      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error("Error sending DM:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor(mConfig.embedColorError)
        .setDescription(
          `❌ Failed to send a quote to ${targetUser.tag}. They may have DMs disabled.`
        );

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
