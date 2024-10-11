const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Quote = require("../../schemas/qoutesSchema");
const tips = require("../../tip.json");

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
      const quotes = await Quote.find().sort({ createdAt: -1 });
      const totalQuotes = quotes.length;
      let page = 0;

      const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

      const generateEmbed = async (start) => {
        const current = quotes.slice(start, start + 5);
        const fields = await Promise.all(
          current.map(async (quote, index) => {
            const user = await client.users.fetch(quote.userID);
            return {
              name: `Quote #${start + index + 1}`,
              value: `"${quote.quoteName}"\n*- ${user.username}*\n*Category: ${quote.category}*`,
            };
          })
        );

        return new EmbedBuilder()
          .setColor("Blurple")
          .setTitle(`📚 Quotes Gallery`)
          .setDescription(
            `Displaying quotes ${start + 1}-${
              start + fields.length
            } of ${totalQuotes}`
          )
          .addFields(fields)
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: `Tip: ${randomTip}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();
      };

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("◀ Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next ▶")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(quotes.length <= 5)
      );

      const message = await interaction.reply({
        embeds: [await generateEmbed(0)],
        components: [buttons],
        fetchReply: true,
      });

      const collector = message.createMessageComponentCollector({
        time: 300000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id === interaction.user.id) {
          i.customId === "next" ? (page += 5) : (page -= 5);
          await i.update({
            embeds: [await generateEmbed(page)],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("previous")
                  .setLabel("◀ Previous")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(page === 0),
                new ButtonBuilder()
                  .setCustomId("next")
                  .setLabel("Next ▶")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(page + 5 >= totalQuotes)
              ),
            ],
          });
        } else {
          await i.reply({
            content: "You cannot interact with these buttons.",
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
        content:
          "An error occurred while fetching the quotes. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
