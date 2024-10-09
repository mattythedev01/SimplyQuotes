require("colors");
const User = require("../../schemas/userSchema");
const QuoteSetup = require("../../schemas/quoteSetupsSchema");
const LastQuote = require("../../schemas/lastQoute");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  console.log(
    "[INFO]".blue +
      `${client.user.username} is online in ${client.guilds.cache.size} servers.`
  );

  const setups = await QuoteSetup.find({});
  let users = await User.find({});
  let totalQuotes = users.length; // Total number of quotes in the database

  // Ensure there are always at least 50 quotes across categories
  const defaultQuotes = [
    {
      quote:
        "The only limit to our realization of tomorrow will be our doubts of today.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote: "It is never too late to be what you might have been.",
      category: "Inspirational",
      author: "Unknown",
    },
  ];

  // Define allQuotes based on the presence of user quotes
  let allQuotes =
    totalQuotes >= 50
      ? users.map((user) => ({
          quote: user.quoteName,
          category: user.category,
          author: user.userID,
        }))
      : defaultQuotes;

  // Function to send a quote
  async function sendQuote() {
    for (const setup of setups) {
      const channel = await client.channels.fetch(setup.channelID);
      if (channel) {
        const randomQuote =
          allQuotes[Math.floor(Math.random() * allQuotes.length)];
        const quoteEmbed = new EmbedBuilder()
          .setColor("#34eb4f")
          .setTitle(`A ${randomQuote.category} quote`)
          .setDescription(`> "${randomQuote.quote}"`)
          .setFooter({
            text: `Quote by: ${randomQuote.author}`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        let messageContent = { embeds: [quoteEmbed] };
        if (setup.roleID) {
          messageContent.content = `<@&${setup.roleID}>`;
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
    }
  }

  // Interval to check and send quotes
  setInterval(async () => {
    const now = new Date();
    for (const setup of setups) {
      const lastQuoteRecord = await LastQuote.findOne({
        guildID: setup.guildID,
      });
      if (lastQuoteRecord) {
        const lastSent = new Date(lastQuoteRecord.lastSentQuote);
        const hoursDiff = (now - lastSent) / 3600000; // Convert milliseconds to hours
        if (hoursDiff >= 24) {
          sendQuote();
          await LastQuote.findOneAndUpdate(
            { guildID: setup.guildID },
            { lastSentQuote: new Date() },
            { upsert: true }
          );
        }
      } else {
        sendQuote();
        await LastQuote.findOneAndUpdate(
          { guildID: setup.guildID },
          { lastSentQuote: new Date() },
          { upsert: true }
        );
      }
    }
  }, 5000); // Check every 24 hours
};
