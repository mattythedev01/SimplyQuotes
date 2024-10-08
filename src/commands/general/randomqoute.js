const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const User = require("../../schemas/userSchema");
const { createCanvas } = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomquote")
    .setDescription("Displays a random quote from the database in a picture.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const quotes = await User.find();
      if (quotes.length === 0) {
        await interaction.reply({
          content: "No quotes found in the database.",
          ephemeral: true,
        });
        return;
      }

      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const user = await client.users.fetch(randomQuote.userID);

      const canvas = createCanvas(800, 200);
      const ctx = canvas.getContext("2d");

      // Create a custom background
      ctx.fillStyle = "#7289DA"; // Discord blurple
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = "30px cursive"; // Enlarged and cursive font for the quote
      ctx.fillStyle = "#FFFFFF"; // White text color
      ctx.textAlign = "center";
      ctx.fillText(`"${randomQuote.quoteName}"`, canvas.width / 2, 80);
      ctx.font = "24px cursive"; // Enlarged and cursive font for the username
      ctx.fillText(`- ${user.username}`, canvas.width / 2, 120);

      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "quote.png",
      });

      await interaction.reply({
        files: [attachment],
        content: `Here's a random quote:`,
        ephemeral: false,
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the randomquote command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
