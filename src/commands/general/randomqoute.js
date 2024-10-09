const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const User = require("../../schemas/userSchema");
const { createCanvas, registerFont } = require("canvas");

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

      const canvas = createCanvas(800, 350); // Adjusted canvas height to better accommodate text
      const ctx = canvas.getContext("2d");

      // Simple background
      ctx.fillStyle = "#7289DA"; // Blurple background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties for the quote
      ctx.font = "bold 30px 'Arial'"; // Adjusted font size for better fit
      ctx.fillStyle = "#FFFFFF"; // White text color
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; // Align text vertically in the middle

      // Wrap text if it's too long to fit on one line
      const text = `"${randomQuote.quoteName}"`;
      const maxWidth = 760; // Max width for text
      const lineHeight = 40; // Line height for breaks
      let yPosition = 100; // Start position for text

      // Function to handle multi-line text
      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }

      wrapText(ctx, text, canvas.width / 2, yPosition, maxWidth, lineHeight);

      // Adjust username position based on quote length
      const usernameYPosition =
        text.length <= 7 ? yPosition + 50 : yPosition + 160;

      // Set text properties for the username
      ctx.font = "italic 20px 'Arial'"; // Adjusted font size for username
      ctx.fillText(`- ${user.username}`, canvas.width / 2, usernameYPosition); // Adjusted position for username to avoid overlap

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
