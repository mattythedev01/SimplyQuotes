const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userSchema = require("../../schemas/userSchema"); // Assuming the schema is in the schemas folder
const tips = require("../../tip.json"); // Import the tips.json file

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Display a user's profile.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to display the profile for")
        .setRequired(false)
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const user = interaction.options.getUser("user") || interaction.user;
      const userData = await userSchema.findOne({ userID: user.id });

      // Retrieve the last quote and its rating using the quoteID stored in the user's data
      let lastQuote = "No quotes added";
      let lastQuoteRating = "No ratings found";
      if (userData && userData.quoteID) {
        const quoteData = await userSchema.findOne({
          quoteID: userData.quoteID,
        });
        lastQuote = quoteData ? quoteData.quoteName : "No quotes found";
        lastQuoteRating =
          quoteData && quoteData.rating
            ? quoteData.rating.toString()
            : "No ratings found";
      }

      const randomTip = tips[Math.floor(Math.random() * tips.length)]; // Select a random tip from the tips array

      const profileEmbed = new EmbedBuilder()
        .setColor("#0099E1") // Enhanced visual appeal with a vibrant blue
        .setTitle(`🌟 ${user.username}'s Profile 🌟`)
        .setDescription(`**Welcome to ${user.username}'s Quote Universe!**`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "🔹 Username", value: `> ${user.username}`, inline: true },
          { name: "🔹 User ID", value: `> ${user.id}`, inline: true },
          {
            name: "📜 Last Quote",
            value: `> "${lastQuote}"`,
            inline: false,
          },
          {
            name: "⭐ Last Quote Rating",
            value: `> ${lastQuoteRating}`,
            inline: false,
          }
        )
        .setFooter({
          text: `Tip: ${randomTip}`, // Use the random tip in the footer
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.reply({ embeds: [profileEmbed], ephemeral: false });
    } catch (err) {
      console.error("[ERROR] Error in the profile command run function:", err);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
