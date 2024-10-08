const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editquotes")
    .setDescription("Edit a specific quote using its ID.")
    .addStringOption((option) =>
      option
        .setName("quoteid")
        .setDescription("The ID of the quote to edit")
        .setRequired(false)
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const quoteId = interaction.options.getString("quoteid");

    try {
      if (!quoteId) {
        const userQuotes = await User.find({ userID: interaction.user.id });
        if (userQuotes.length === 0) {
          await interaction.reply({
            content: "You have no quotes in the database.",
            ephemeral: true,
          });
          return;
        }

        const quoteList = userQuotes.map((quote, index) => ({
          name: `Quote #${index + 1}`,
          value: `"${quote.quoteName}"\nID: ${quote.quoteID}`,
          inline: false,
        }));

        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("Your Quotes")
          .addFields(quoteList)
          .setFooter({
            text: "You can edit a quote using /editquotes <quoteID>.",
          })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const quote = await User.findOne({
        quoteID: quoteId,
        userID: interaction.user.id,
      });

      if (!quote) {
        await interaction.reply({
          content: `No quote found with ID ${quoteId} or you do not have permission to edit it.`,
          ephemeral: false,
        });
        return;
      }

      await interaction.reply({
        content: `Your current quote: "${quote.quoteName}". What would you like to rename it to?`,
        ephemeral: false,
      });

      const filter = (m) => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({
        filter,
        time: 60000,
        max: 1,
      });

      collector.on("collect", async (m) => {
        quote.quoteName = m.content;
        await quote.save();
        await interaction.followUp({
          content: `Quote updated to: "${quote.quoteName}"`,
          ephemeral: false,
        });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          interaction.followUp({
            content: "You did not provide a new quote name in time.",
            ephemeral: false,
          });
        }
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the editquotes command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
