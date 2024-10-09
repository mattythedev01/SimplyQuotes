require("dotenv/config");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
});

eventHandler(client);

client.on("messageCreate", (message) => {
  if (message.mentions.has(client.user) && !message.author.bot) {
    const embed = new EmbedBuilder()
      .setColor("#4A5EAD") // A more soothing blue color
      .setTitle("🌟 Welcome to SimplyQuotes! 🌟")
      .setDescription(
        "Hello! 👋 To begin adding inspirational quotes to our collection, please use the command `/information`. This will guide you through the process of contributing your favorite quotes and participating in our community."
      )
      .addFields(
        {
          name: "🔧 Admin Commands",
          value:
            "Use `/quote-setup <role> <channel>` to configure the bot for your server.",
          inline: false,
        },
        {
          name: "📚 Need Help?",
          value: "Type `/help` for more commands and detailed instructions.",
          inline: false,
        }
      )
      .setFooter({
        text: "Thank you for using SimplyQuote!",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL());

    message.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);
