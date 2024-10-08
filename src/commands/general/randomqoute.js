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

      // Simple background
      ctx.fillStyle = "#7289DA"; // Blurple background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties for the quote
      ctx.font = "bold 40px 'Brush Script MT'"; // Bold and cursive font for the quote
      ctx.fillStyle = "#FFFFFF"; // White text color
      ctx.textAlign = "center";
      ctx.fillText(`"${randomQuote.quoteName}"`, canvas.width / 2, 100);
      // Set text properties for the username
      ctx.font = "italic 30px 'Brush Script MT'"; // Italic and cursive font for the username
      ctx.fillText(`- ${user.username}`, canvas.width / 2, 150);

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
