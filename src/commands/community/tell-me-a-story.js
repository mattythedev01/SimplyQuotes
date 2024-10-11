const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Quote = require("../../schemas/qoutesSchema");
const tips = require("../../tip.json");
const natural = require("natural");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tellmeastory")
    .setDescription("Tells a story based on a random quote from the database.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      // Fetch a random quote from the database
      const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);

      if (!randomQuote || randomQuote.length === 0) {
        await interaction.reply({
          content: "No quotes found in the database.",
          ephemeral: true,
        });
        return;
      }

      const quote = randomQuote[0];

      // Generate a simple story based on the quote using natural language processing
      const tokenizer = new natural.WordTokenizer();
      const words = tokenizer.tokenize(quote.quoteName);

      const story = generateSimpleStory(words);
      const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

      const storyEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("A Story Inspired by a Quote")
        .setDescription(`"${quote.quoteName}"\n\n${story}`)
        .setFooter({
          text: `Tip: ${randomTip}`,
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
        content: "An error occurred while generating the story.",
        ephemeral: true,
      });
    }
  },
};

function generateSimpleStory(words) {
  const storyTemplates = [
    "Once upon a time, there was a person who believed in {0}. They faced many challenges, but their faith in {1} kept them going. In the end, they learned that {2} was the key to happiness.",
    "In a world where {0} seemed impossible, one individual dared to dream. Through perseverance and {1}, they showed everyone that {2} could become a reality.",
    "The old wise man always said, '{0}'. Nobody understood until a young hero emerged, embodying {1}. Their journey proved that {2} was more than just words.",
    "In a small town, the concept of {0} was foreign. But when a stranger arrived, preaching about {1}, everything changed. The town learned that {2} could transform lives.",
    "A child once asked, 'What is {0}?' The answer came through years of experience, teaching them that {1} and {2} were interconnected in the grand tapestry of life.",
  ];

  const template =
    storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
  const uniqueWords = [...new Set(words)].filter((word) => word.length > 3);

  let story = template;
  for (let i = 0; i < 3; i++) {
    const word =
      uniqueWords[i] || words[Math.floor(Math.random() * words.length)];
    story = story.replace(`{${i}}`, word);
  }

  return story;
}
