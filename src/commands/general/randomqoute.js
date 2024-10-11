const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const Quote = require("../../schemas/qoutesSchema");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomquote")
    .setDescription(
      "Displays a random quote from the database in a beautiful picture."
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);
      if (!randomQuote || randomQuote.length === 0) {
        await interaction.reply({
          content: "No quotes found in the database.",
          ephemeral: true,
        });
        return;
      }

      const quote = randomQuote[0];
      const user = await client.users.fetch(quote.userID);

      // Create a larger canvas for better quality
      const canvas = createCanvas(1200, 630);
      const ctx = canvas.getContext("2d");

      // Load and draw a beautiful background image
      const backgroundImage = await loadImage(
        path.join(__dirname, "../../assets/quote_background.jpg")
      );
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Add a semi-transparent overlay for better text visibility
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties for the quote
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Wrap and draw the quote text
      const text = `"${quote.quoteName}"`;
      const maxWidth = 1000;
      const lineHeight = 60;
      let yPosition = 315;

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
        return y + lineHeight; // Return the Y position of the last line
      }

      const lastLineY = wrapText(
        ctx,
        text,
        canvas.width / 2,
        yPosition,
        maxWidth,
        lineHeight
      );

      // Draw a decorative line
      ctx.beginPath();
      ctx.moveTo(300, lastLineY + 40);
      ctx.lineTo(900, lastLineY + 40);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Set text properties for the username
      ctx.font = "italic 32px Arial";
      ctx.fillText(`- ${user.username}`, canvas.width / 2, lastLineY + 100);

      // Add a subtle watermark
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText("SimplyQuotes", canvas.width - 80, canvas.height - 20);

      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "inspirational_quote.png",
      });

      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("Inspirational Quote")
        .setDescription("Here's a beautifully crafted quote to inspire you:")
        .setImage("attachment://inspirational_quote.png")
        .setFooter({
          text: "SimplyQuotes | Spreading wisdom one quote at a time",
        });

      await interaction.reply({
        embeds: [embed],
        files: [attachment],
        ephemeral: false,
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the randomquote command run function:",
        err
      );
      await interaction.reply({
        content:
          "An error occurred while creating your inspirational quote. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
