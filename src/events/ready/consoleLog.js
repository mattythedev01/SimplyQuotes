require("colors");
const User = require("../../schemas/userSchema");
const QuoteSetup = require("../../schemas/quoteSetupsSchema");
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
  if (totalQuotes < 50) {
    const defaultQuotes = [
      {
        quoteName: "Life is what happens when you're busy making other plans.",
        category: "Inspirational",
        userID: "Default",
      },
      {
        quoteName:
          "The only limit to our realization of tomorrow is our doubts of today.",
        category: "Motivation",
        userID: "Default",
      },
      {
        quoteName:
          "It does not matter how slowly you go as long as you do not stop.",
        category: "Motivation",
        userID: "Default",
      },
      {
        quoteName: "Optimism is the faith that leads to achievement.",
        category: "Inspirational",
        userID: "Default",
      },
      {
        quoteName: "With the new day comes new strength and new thoughts.",
        category: "Inspirational",
        userID: "Default",
      },
      {
        quoteName: "Life is 10% what happens to us and 90% how we react to it.",
        category: "Inspirational",
        userID: "Default",
      },
      {
        quoteName: "Change your thoughts and you change your world.",
        category: "Inspirational",
        userID: "Default",
      },
      {
        quoteName:
          "It is during our darkest moments that we must focus to see the light.",
        category: "Inspirational",
        userID: "Default",
      },
      {
        quoteName: "Try to be a rainbow in someone's cloud.",
        category: "Friendship",
        userID: "Default",
      },
      {
        quoteName:
          "A single rose can be my garden... a single friend, my world.",
        category: "Friendship",
        userID: "Default",
      },
      {
        quoteName:
          "Friends show their love in times of trouble, not in happiness.",
        category: "Friendship",
        userID: "Default",
      },
      {
        quoteName:
          "A friend is someone who gives you total freedom to be yourself.",
        category: "Friendship",
        userID: "Default",
      },
      {
        quoteName:
          "A real friend is one who walks in when the rest of the world walks out.",
        category: "Friendship",
        userID: "Default",
      },
      {
        quoteName:
          "Love is when the other person's happiness is more important than your own.",
        category: "Love",
        userID: "Default",
      },
      {
        quoteName: "The best thing to hold onto in life is each other.",
        category: "Love",
        userID: "Default",
      },
      {
        quoteName: "We are shaped and fashioned by what we love.",
        category: "Love",
        userID: "Default",
      },
      {
        quoteName:
          "When we love, we always strive to become better than we are.",
        category: "Love",
        userID: "Default",
      },
      {
        quoteName:
          "Love cures people - both the ones who give it and the ones who receive it.",
        category: "Love",
        userID: "Default",
      },
      {
        quoteName: "Humor is mankind's greatest blessing.",
        category: "Humor",
        userID: "Default",
      },
      {
        quoteName: "A day without laughter is a day wasted.",
        category: "Humor",
        userID: "Default",
      },
      {
        quoteName: "The most wasted of days is one without laughter.",
        category: "Humor",
        userID: "Default",
      },
      {
        quoteName: "You can't stay mad at somebody who makes you laugh.",
        category: "Humor",
        userID: "Default",
      },
      {
        quoteName:
          "Humor is infectious. The sound of roaring laughter is far more contagious than any cough.",
        category: "Humor",
        userID: "Default",
      },
      {
        quoteName:
          "Mental health needs a great deal of attention. It's the final taboo and it needs to be faced and dealt with.",
        category: "Mental Health",
        userID: "Default",
      },
      {
        quoteName:
          "It's up to you today to start making healthy choices. Not choices that are just healthy for your body, but healthy for your mind.",
        category: "Mental Health",
        userID: "Default",
      },
      {
        quoteName:
          "Self-esteem is not a luxury; it is a profound spiritual need.",
        category: "Mental Health",
        userID: "Default",
      },
      {
        quoteName:
          "What mental health needs is more sunlight, more candor, and more unashamed conversation.",
        category: "Mental Health",
        userID: "Default",
      },
      {
        quoteName: "There is hope, even when your brain tells you there isn't.",
        category: "Mental Health",
        userID: "None",
      },
    ];

    // If there are fewer than 10 quotes, combine Defaults with existing ones
    if (totalQuotes < 10) {
      users = users.concat(defaultQuotes.slice(0, 10 - totalQuotes));
    }
    totalQuotes = users.length;
  }

  // Send a quote every 24 hours to every channel in the database
  setInterval(async () => {
    // Refresh the setups list to include new channels added to the database
    const updatedSetups = await QuoteSetup.find({});

    // Select a random user who has a quote
    const userWithQuote = users[Math.floor(Math.random() * users.length)];
    if (userWithQuote && userWithQuote.quoteName) {
      updatedSetups.forEach(async (setup) => {
        const channel = await client.channels.fetch(setup.channelID);
        if (channel) {
          const user = await client.users.fetch(userWithQuote.userID);
          const quoteEmbed = new EmbedBuilder()
            .setColor("#34eb4f") // Bright green color
            .setTitle(`A ${userWithQuote.category} quote`)
            .setDescription(
              `> "${userWithQuote.quoteName}" - ${user.username} (${userWithQuote.userID})`
            )
            .setFooter({
              text: `Total quotes: ${totalQuotes}`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          let messageContent = { embeds: [quoteEmbed] };
          if (setup.roleID) {
            messageContent.content = `<@&${setup.roleID}>`;
          } else {
            messageContent.content = "";
          }

          // Send the quote message
          channel.send(messageContent);
        }
      });
    }
  }, 86400000);
};
