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
    {
      quote: "You must be the change you wish to see in the world.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote:
        "What you get by achieving your goals is not as important as what you become by achieving your goals.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote: "Believe you can and you're halfway there.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote: "Every moment is a fresh beginning.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Change your thoughts and you change your world.",
      category: "Mental Health",
      author: "Unknown",
    },
    {
      quote: "With the new day comes new strength and new thoughts.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote:
        "Happiness is not something ready made. It comes from your own actions.",
      category: "Mental Health",
      author: "Unknown",
    },
    {
      quote:
        "If you want to live a happy life, tie it to a goal, not to people or things.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote: "Laugh as much as you breathe and love as long as you live.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "The purpose of our lives is to be happy.",
      category: "Mental Health",
      author: "Unknown",
    },
    {
      quote: "Life is what happens when you're busy making other plans.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "Get busy living or get busy dying.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote: "You only live once, but if you do it right, once is enough.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote:
        "Many of life’s failures are people who did not realize how close they were to success when they gave up.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote:
        "Money and success don’t change people; they merely amplify what is already there.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Your time is limited, don’t waste it living someone else’s life.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Not how long, but how well you have lived is the main thing.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote:
        "If life were predictable it would cease to be life, and be without flavor.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote:
        "The whole secret of a successful life is to find out what is one’s destiny to do, and then do it.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "In order to write about life first you must live it.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote:
        "The big lesson in life, baby, is never be scared of anyone or anything.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote:
        "Sing like no one’s listening, love like you’ve never been hurt, dance like nobody’s watching, and live like it’s heaven on earth.",
      category: "Love",
      author: "Unknown",
    },
    {
      quote:
        "Curiosity about life in all of its aspects, I think, is still the secret of great creative people.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote:
        "Life is not a problem to be solved, but a reality to be experienced.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "The unexamined life is not worth living.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Turn your wounds into wisdom.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "The way to get started is to quit talking and begin doing.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote: "The purpose of our lives is to be happy.",
      category: "Mental Health",
      author: "Unknown",
    },
    {
      quote: "Life is really simple, but men insist on making it complicated.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "May you live all the days of your life.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Life itself is the most wonderful fairy tale.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Do not let making a living prevent you from making a life.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Life is ours to be spent, not to be saved.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote:
        "Keep smiling, because life is a beautiful thing and there’s so much to smile about.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "Life is a long lesson in humility.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote:
        "In three words I can sum up everything I’ve learned about life: It goes on.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "Love the life you live. Live the life you love.",
      category: "Love",
      author: "Unknown",
    },
    {
      quote: "Life is made of ever so many partings welded together.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Life is trying things to see if they work.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote:
        "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote:
        "My mama always said, life is like a box of chocolates. You never know what you’re gonna get.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "Watch your life and doctrine closely.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote:
        "Life is a succession of lessons which must be lived to be understood.",
      category: "Inspirational",
      author: "Unknown",
    },
    {
      quote: "Life is really simple, but we insist on making it complicated.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote:
        "Life is a dream for the wise, a game for the fool, a comedy for the rich, a tragedy for the poor.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "When life gives you lemons, make lemonade.",
      category: "Humor",
      author: "Unknown",
    },
    {
      quote: "Life without love is like a tree without blossoms or fruit.",
      category: "Love",
      author: "Unknown",
    },
    {
      quote: "The only impossible journey is the one you never begin.",
      category: "Motivational",
      author: "Unknown",
    },
    {
      quote:
        "In the end, it’s not the years in your life that count. It’s the life in your years.",
      category: "Inspirational",
      author: "Unknown",
    },
  ];

  // Define allQuotes based on the presence of user quotes
  let allQuotes;
  if (totalQuotes >= 50) {
    allQuotes = users.map((user) => ({
      quote: user.quoteName, // Assuming 'quoteName' is the field in userSchema
      category: user.category, // Using 'category' directly from userSchema
      author: user.userID, // Temporarily store userID to fetch username later
    }));
  } else {
    allQuotes = defaultQuotes;
  }

  // Send a quote every 24 hours to every channel in the database
  setups.forEach(async (setup) => {
    const now = new Date();
    const nextTriggerTime = new Date(now);
    nextTriggerTime.setDate(now.getDate() + 1); // Set for 24 hours later

    // Select a random quote from allQuotes
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];

    const channel = await client.channels.fetch(setup.channelID);
    if (channel) {
      let footerText;
      if (defaultQuotes.includes(randomQuote)) {
        footerText = `Total default quotes: ${totalQuotes}`;
      } else {
        footerText = `Quote by: ${randomQuote.author}`;
      }

      const quoteEmbed = new EmbedBuilder()
        .setColor("#34eb4f") // Bright green color
        .setTitle(`A ${randomQuote.category} quote`)
        .setDescription(`> "${randomQuote.quote}"`)
        .setFooter({
          text: footerText,
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

  // Set an interval to repeat every 24 hours
  setInterval(async () => {
    setups.forEach(async (setup) => {
      const channel = await client.channels.fetch(setup.channelID);
      if (channel) {
        const randomQuote =
          allQuotes[Math.floor(Math.random() * allQuotes.length)];

        let footerText;
        if (defaultQuotes.includes(randomQuote)) {
          footerText = `Total quotes: ${totalQuotes}`;
        } else {
          footerText = `Quote by: ${randomQuote.author}`;
        }

        const quoteEmbed = new EmbedBuilder()
          .setColor("#34eb4f")
          .setTitle(`A ${randomQuote.category} quote`)
          .setDescription(`> "${randomQuote.quote}"`)
          .setFooter({
            text: footerText,
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
  }, 86400000); // Corrected interval to 24 hours in milliseconds
};
