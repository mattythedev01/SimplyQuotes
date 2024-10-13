const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
const User = require("../../schemas/userSchema");
const QuoteSetup = require("../../schemas/quoteSetupsSchema");
const LastQuote = require("../../schemas/lastQoute");
const Quote = require("../../schemas/qoutesSchema");
const defaultQuotes = require("../../defaultQuotes.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emit an event for testing purposes")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("The event to emit")
        .setRequired(true)
        .addChoices(
          { name: "Ready", value: "ready" },
          { name: "Quote", value: "quote" }
        )
    )
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),

  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    if (!config.developersIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    const eventToEmit = interaction.options.getString("event");

    if (!eventToEmit) {
      await interaction.reply({
        content: "No event specified. Please choose an event to emit.",
        ephemeral: true,
      });
      return;
    }

    try {
      switch (eventToEmit) {
        case "ready":
          await emitReadyEvent(client);
          break;
        case "quote":
          await emitQuoteEvent(client);
          break;
        default:
          throw new Error(`Invalid event specified: ${eventToEmit}`);
      }

      await interaction.reply({
        content: `The ${eventToEmit} event has been emitted successfully.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error emitting ${eventToEmit} event:`, error);
      await interaction.reply({
        content: `An error occurred while emitting the ${eventToEmit} event: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};

async function emitReadyEvent(client) {
  console.log(
    "[INFO]".blue +
      `${client.user.username} is online in ${client.guilds.cache.size} servers.`
  );
}

async function emitQuoteEvent(client) {
  const setups = await QuoteSetup.find({});
  const allQuotes = await Quote.find({});

  const sourceArray = allQuotes.length > 0 ? allQuotes : defaultQuotes;
  const randomQuote =
    sourceArray[Math.floor(Math.random() * sourceArray.length)];

  let quoteAuthor = "Unknown";
  if (sourceArray !== defaultQuotes) {
    try {
      const user = await User.findOne({ userID: randomQuote.userID });
      if (user) {
        quoteAuthor = user.username;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  const quoteEmbed = new EmbedBuilder()
    .setColor("#FFD700")
    .setTitle(`✨ Daily Quotes! ✨`)
    .setDescription(
      `
      📜 **A ${randomQuote.category} Quote**
      
      > *"${randomQuote.quoteName}"*
      
      🎭 **Author:** ${quoteAuthor}
    `
    )
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      { name: "📚 Category", value: randomQuote.category, inline: true },
      { name: "🕰️ Shared At", value: new Date().toLocaleString(), inline: true }
    )
    .setFooter({
      text: `Brought to you by ${client.user.username} | Inspiring minds daily`,
      iconURL: client.user.displayAvatarURL(),
    })
    .setTimestamp();

  for (const setup of setups) {
    const channel = await client.channels.fetch(setup.channelID);
    if (channel) {
      let messageContent = { embeds: [quoteEmbed] };
      if (setup.roleID) {
        messageContent.content = `<@&${setup.roleID}> Today's quote has arrived! 🌟`;
      }
      await channel.send(messageContent);
    }
  }

  // Update LastQuote for each guild
  for (const setup of setups) {
    await LastQuote.findOneAndUpdate(
      { guildID: setup.guildID },
      { lastSentQuote: new Date() },
      { upsert: true }
    );
  }
}
