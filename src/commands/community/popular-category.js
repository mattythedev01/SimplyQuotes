const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Quote = require("../../schemas/userSchema"); // Assuming the schema is named quoteSchema and contains fields for categories and quote names

module.exports = {
  data: new SlashCommandBuilder()
    .setName("popularcategory")
    .setDescription(
      "Displays the top 3 most used categories based on the number of quotes."
    )
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      // Aggregate quotes to count occurrences of each category
      const categoryData = await Quote.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
      ]);

      if (categoryData.length === 0) {
        await interaction.reply("No categories found in the database.");
        return;
      }

      // Create an embed message to display the results
      const embed = new EmbedBuilder()
        .setTitle("Top 3 Popular Quote Categories")
        .setColor("Blue")
        .setDescription(
          "Here are the most popular categories based on the number of quotes:"
        );

      categoryData.forEach((category, index) => {
        embed.addFields({
          name: `#${index + 1} Category`,
          value: `${category._id} - ${category.count} Quotes`,
        });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("Failed to fetch category data.");
    }
  },
};
