const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Quote = require("../../schemas/qoutesSchema");
const approveDenySchema = require("../../schemas/approveDenySchema");
const tips = require("../../tip.json");

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
    const quoteID = interaction.options.getString("quoteid");
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    try {
      if (!quoteID) {
        const userQuotes = await Quote.find({ userID: interaction.user.id });
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
            text: randomTip,
          })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const quote = await Quote.findOne({
        quoteID: quoteID,
        userID: interaction.user.id,
      });

      if (!quote) {
        await interaction.reply({
          content: `No quote found with ID ${quoteID} or you do not have permission to edit it.`,
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
        const newQuoteName = m.content;

        // Create a new entry in approveDenySchema for approval
        const newApprovalEntry = new approveDenySchema({
          userId: interaction.user.id,
          quoteId: quote.quoteID,
          category: quote.category,
          quoteName: newQuoteName,
          rating: quote.rating,
        });
        await newApprovalEntry.save();

        await interaction.followUp({
          content: `Your edited quote: "${newQuoteName}" has been submitted for approval.`,
          ephemeral: false,
        });

        // Notify devs about the edit for approval
        const devChannel = await client.channels.fetch("1290033222700240987");
        if (devChannel) {
          devChannel.send({
            content: `Quote edit submitted by <@${interaction.user.id}> for review:\nOriginal: "${quote.quoteName}"\nEdited: "${newQuoteName}"\n(ID: ${quote.quoteID})`,
          });
        }
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
