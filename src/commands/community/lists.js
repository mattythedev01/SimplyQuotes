const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Quote = require("../../schemas/qoutesSchema");
const badges = require("../../badges.json").badges;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lists")
    .setDescription("Lists quotes, authors, or badges with pagination.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Choose to list quotes, authors, or badges")
        .setRequired(true)
        .addChoices(
          { name: "Quotes", value: "quotes" },
          { name: "Authors", value: "authors" },
          { name: "Badges", value: "badges" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Page number to display")
        .setMinValue(1)
    )
    .toJSON(),

  run: async (client, interaction) => {
    try {
      const type = interaction.options.getString("type");
      const page = interaction.options.getInteger("page") || 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;

      if (type === "quotes") {
        await module.exports.listQuotes(
          client,
          interaction,
          page,
          pageSize,
          skip
        );
      } else if (type === "authors") {
        await module.exports.listAuthors(
          client,
          interaction,
          page,
          pageSize,
          skip
        );
      } else if (type === "badges") {
        await module.exports.listBadges(
          client,
          interaction,
          page,
          pageSize,
          skip
        );
      }
    } catch (err) {
      console.error("[ERROR] Error in the lists command:", err);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },

  listQuotes: async (client, interaction, page, pageSize, skip) => {
    const totalQuotes = await Quote.countDocuments();
    const totalPages = Math.ceil(totalQuotes / pageSize);

    if (totalQuotes === 0) {
      return interaction.reply({
        content: "No quotes found in the database.",
        ephemeral: true,
      });
    }

    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const quoteDescriptions = await Promise.all(
      quotes.map(async (quote, index) => {
        const user = await client.users.fetch(quote.userID);
        return `${skip + index + 1}. "${quote.quoteName}" - ${
          user.username
        }\n> ||[Quote ID: ${quote.quoteID}]||`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Quotes (Page ${page}/${totalPages})`)
      .setDescription(quoteDescriptions.join("\n"))
      .setTimestamp();

    await module.exports.sendPaginatedEmbed(
      interaction,
      embed,
      page,
      totalPages,
      "quotes"
    );
  },

  listAuthors: async (client, interaction, page, pageSize, skip) => {
    const uniqueAuthors = await Quote.distinct("userID");
    const totalAuthors = uniqueAuthors.length;
    const totalPages = Math.ceil(totalAuthors / pageSize);

    if (totalAuthors === 0) {
      return interaction.reply({
        content: "No authors found in the database.",
        ephemeral: true,
      });
    }

    const authors = uniqueAuthors.slice(skip, skip + pageSize);

    const authorDescriptions = await Promise.all(
      authors.map(async (userID, index) => {
        const user = await client.users.fetch(userID);
        return `${skip + index + 1}. ${user.username}`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Authors (Page ${page}/${totalPages})`)
      .setDescription(authorDescriptions.join("\n"))
      .setTimestamp();

    await module.exports.sendPaginatedEmbed(
      interaction,
      embed,
      page,
      totalPages,
      "authors"
    );
  },

  listBadges: async (client, interaction, page, pageSize, skip) => {
    const totalBadges = badges.length;
    const totalPages = Math.ceil(totalBadges / pageSize);

    if (totalBadges === 0) {
      return interaction.reply({
        content: "No badges found in the database.",
        ephemeral: true,
      });
    }

    const paginatedBadges = badges.slice(skip, skip + pageSize);

    const badgeDescriptions = paginatedBadges.map((badge, index) => {
      return `${skip + index + 1}. ${badge.emoji} **${badge.name}**\n> ${
        badge.description
      }`;
    });

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle(`Badges (Page ${page}/${totalPages})`)
      .setDescription(badgeDescriptions.join("\n\n"))
      .setTimestamp();

    await module.exports.sendPaginatedEmbed(
      interaction,
      embed,
      page,
      totalPages,
      "badges"
    );
  },

  sendPaginatedEmbed: async (interaction, embed, page, totalPages, type) => {
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 1),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === totalPages)
    );

    const response = await interaction.reply({
      embeds: [embed],
      components: [buttons],
      ephemeral: false,
      fetchReply: true,
    });

    const collector = response.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      const newPage = i.customId === "next" ? page + 1 : page - 1;
      await module.exports.run(client, {
        ...interaction,
        options: {
          getString: () => type,
          getInteger: () => newPage,
        },
      });
      await i.update({ components: [] });
    });

    collector.on("end", () => {
      interaction.editReply({ components: [] });
    });
  },
};
