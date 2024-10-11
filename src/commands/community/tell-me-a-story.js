const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tips = require("../../tip.json"); // Import the tips.json file

const stories = [
  "Once upon a time in a land far, far away, there lived a wise old owl who knew the secrets of the forest. Every creature in the forest sought his wisdom to solve their problems.",
  "In the heart of the ancient forest, a hidden treasure lay buried. Many adventurers tried to find it, guided by maps and old tales, but only those pure of heart could see the path.",
  "Under the vast, starlit sky, a young girl named Lila made a wish every night for a month, hoping for a friend. One night, a shooting star landed in her backyard, bringing with it a magical creature from another world.",
  "Beside the whispering streams of the old valley, an old mill stood. The miller was known for telling stories that were said to be enchanted. People from villages nearby would visit to hear his tales and find solace.",
  "In a small village on the edge of the kingdom, a festival was held every year that brought joy and laughter. But one year, the laughter was stolen by a mischievous spirit, and the villagers had to embark on a quest to bring joy back.",
  "During the reign of the great lion king, peace had settled over the savannah. However, the lion king knew his time was coming to an end and sought an heir worthy of continuing his legacy of fairness and strength.",
  "In a realm ruled by dragons, humans were considered mere myths until one brave soul ventured into the dragon's territory, sparking an unlikely friendship that changed the realm forever.",
  "On a mysterious island that appeared once every hundred years, ancient ruins held clues to a lost civilization. Explorers raced against time to uncover its secrets before the island vanished again.",
  "In the deepest dungeons of the haunted castle, a forgotten prince was imprisoned. His only hope was a band of unlikely heroes who, guided by a mysterious map, embarked on a perilous journey to rescue him.",
  "Within the walls of the enchanted garden, every flower had a story. One particular rose, wilting and ignored, held the key to the garden's ancient magic, waiting for someone to discover its secret.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tellmeastory")
    .setDescription("Tells a randomly selected full story based on a quote.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const story = stories[Math.floor(Math.random() * stories.length)];
      const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

      const storyEmbed = new EmbedBuilder()
        .setColor("#0099ff") // Blue color
        .setTitle("A Randomly Selected Story Based on a Quote.")
        .setDescription(story)
        .setFooter({
          text: `Tip: ${randomTip}`, // Use the random tip in the footer
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [storyEmbed],
        ephemeral: false,
      });
    } catch (err) {
      console.error(
        "[ERROR] Error in the tellmeastory command run function:",
        err
      );
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
