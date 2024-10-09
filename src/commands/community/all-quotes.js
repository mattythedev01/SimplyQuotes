const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const User = require("../../schemas/userSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("allquotes")
    .setDescription("Lists all quotes with pagination.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const quotes = await User.find().sort({ createdAt: -1 });
      const totalQuotes = quotes.length;
      let page = 0;

      const generateEmbed = async (start) => {
        const current = quotes.slice(start, start + 10);
        const descriptions = await Promise.all(
          current.map(async (quote, index) => {
            const user = await client.users.fetch(quote.userID);
            return `${start + index + 1}. "${quote.quoteName}" - ${
              user.username
            }`;
          })
        );

        return new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(
            `Quotes ${start + 1}-${
              start + descriptions.length
            } of ${totalQuotes}`
          )
          .setDescription(descriptions.join("\n"))
          .setFooter({ text: "Use the buttons to navigate between pages." })
          .setTimestamp();
      };

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(quotes.length <= 10)
      );

      const message = await interaction.reply({
        embeds: [await generateEmbed(0)],
        components: [buttons],
        fetchReply: true,
      });

      const collector = message.createMessageComponentCollector({
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id === interaction.user.id) {
          i.customId === "next" ? (page += 10) : (page -= 10);
          await i.update({
            embeds: [await generateEmbed(page)],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("previous")
                  .setLabel("Previous")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(page === 0),
                new ButtonBuilder()
                  .setCustomId("next")
                  .setLabel("Next")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(page + 10 >= totalQuotes)
              ),
            ],
          });
        } else {
          await i.reply({
            content: "You cannot interact with this button.",
            ephemeral: true,
          });
        }
      });

      collector.on("end", () => {
        message.edit({ components: [] });
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the allquotes command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
