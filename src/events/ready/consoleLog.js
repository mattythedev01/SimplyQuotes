require("colors");
const User = require("../../schemas/userSchema");
const QuoteSetup = require("../../schemas/quoteSetupsSchema");
const LastQuote = require("../../schemas/lastQoute");
const Quote = require("../../schemas/qoutesSchema");
const { EmbedBuilder } = require("discord.js");
const defaultQuotes = require("../../defaultQuotes.json");

module.exports = async (client) => {
  console.log(
    "[INFO]".blue +
      `${client.user.username} is online in ${client.guilds.cache.size} servers.`
  );

  const setups = await QuoteSetup.find({});
  let users = await User.find({});
  let totalQuotes = users.length; // Total number of quotes in the database

  // Define allQuotes based on the presence of user quotes
  let allQuotes = await Quote.find({});

  // Function to send a quote
  async function sendQuote() {
    // Randomly select a quote from either user quotes or default quotes
    const sourceArray =
      Math.random() < 0.5 || allQuotes.length === 0 ? defaultQuotes : allQuotes;
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
      .setColor("#FFD700") // Gold color
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
        {
          name: "🕰️ Shared At",
          value: new Date().toLocaleString(),
          inline: true,
        }
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

        // Log the last sent quote
        await LastQuote.findOneAndUpdate(
          { guildID: setup.guildID },
          { lastSentQuote: new Date() },
          { upsert: true }
        );
      }
    }
  }

  // Check and send initial quote if needed
  const now = new Date();
  for (const setup of setups) {
    const lastQuoteRecord = await LastQuote.findOne({
      guildID: setup.guildID,
    });
    if (
      !lastQuoteRecord ||
      (now - new Date(lastQuoteRecord.lastSentQuote)) / 3600000 >= 24
    ) {
      sendQuote();
      break; // Only send one quote, then exit the loop
    }
  }

  // Interval to check and send quotes
  setInterval(async () => {
    const now = new Date();
    let quoteSent = false;
    for (const setup of setups) {
      if (quoteSent) break; // If a quote has been sent, exit the loop
      const lastQuoteRecord = await LastQuote.findOne({
        guildID: setup.guildID,
      });
      if (lastQuoteRecord) {
        const lastSent = new Date(lastQuoteRecord.lastSentQuote);
        const hoursDiff = (now - lastSent) / 3600000; // Convert milliseconds to hours
        if (hoursDiff >= 24) {
          await sendQuote();
          quoteSent = true;
        }
      } else {
        await sendQuote();
        quoteSent = true;
      }
    }
  }, 3600000); // Check every hour
};
