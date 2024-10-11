const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const TriviaSchema = require("../../schemas/triviaSchema");
const UserSchema = require("../../schemas/userSchema");
const QuoteSchema = require("../../schemas/qoutesSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quotetrivia")
    .setDescription("Play a quote trivia game with another user")
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The user you want to play against")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("rounds")
        .setDescription("Number of rounds to play (default: 3)")
        .setMinValue(1)
        .setMaxValue(10)
    )
    .toJSON(),
  run: async (client, interaction) => {
    const opponent = interaction.options.getUser("opponent");
    const rounds = interaction.options.getInteger("rounds") || 3;

    if (opponent.id === interaction.user.id) {
      return interaction.reply(
        "You can't play against yourself. Please choose a different opponent."
      );
    }

    await interaction.reply(
      `<@${interaction.user.id}> <@${opponent.id}> Are you guys ready to play ${rounds} rounds of quote Trivia?`
    );

    const filter = (m) =>
      [interaction.user.id, opponent.id].includes(m.author.id) &&
      ["yes", "y"].includes(m.content.toLowerCase());
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 30000,
      max: 2,
    });

    let readyPlayers = new Set();

    collector.on("collect", (m) => {
      readyPlayers.add(m.author.id);
      m.reply(`${m.author} is ready!`);
    });

    collector.on("end", async (collected) => {
      if (readyPlayers.size !== 2) {
        return interaction.followUp(
          "Not all players were ready. The game has been cancelled."
        );
      }

      let playerScores = {
        [interaction.user.id]: 0,
        [opponent.id]: 0,
      };

      for (let round = 1; round <= rounds; round++) {
        await playRound(interaction, opponent, round, playerScores);
      }

      const winner =
        playerScores[interaction.user.id] > playerScores[opponent.id]
          ? interaction.user.id
          : playerScores[opponent.id] > playerScores[interaction.user.id]
          ? opponent.id
          : null;

      await updateTriviaStats(interaction.user.id, opponent.id, winner, rounds);

      if (winner) {
        await interaction.followUp(
          `Game Over! <@${winner}> wins with a score of ${playerScores[winner]}!`
        );
      } else {
        await interaction.followUp(
          `Game Over! It's a tie! Both players scored ${
            playerScores[interaction.user.id]
          }.`
        );
      }
    });
  },
};

async function playRound(interaction, opponent, round, playerScores) {
  const quotes = await QuoteSchema.find({}).select("quoteName category");
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];

  const quoteNames = quotes.map((quote) => quote.quoteName);
  const shuffledQuoteNames = quoteNames
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const correctAnswer =
    shuffledQuoteNames[Math.floor(Math.random() * shuffledQuoteNames.length)];

  const embed = new EmbedBuilder()
    .setTitle(`Quote Trivia - Round ${round}`)
    .setDescription(`Which quote belongs to the category: ${randomCategory}?`)
    .setColor("#FFA500");

  const row = new ActionRowBuilder().addComponents(
    shuffledQuoteNames.map((quoteName) =>
      new ButtonBuilder()
        .setCustomId(quoteName)
        .setLabel(quoteName)
        .setStyle(ButtonStyle.Primary)
    )
  );

  const triviaMessage = await interaction.followUp({
    embeds: [embed],
    components: [row],
  });

  const buttonFilter = (i) =>
    [interaction.user.id, opponent.id].includes(i.user.id) &&
    shuffledQuoteNames.includes(i.customId);
  const buttonCollector = triviaMessage.createMessageComponentCollector({
    filter: buttonFilter,
    time: 30000,
    max: 2,
  });

  let answers = {};

  buttonCollector.on("collect", async (i) => {
    answers[i.user.id] = i.customId;
    await i.reply({ content: "Answer submitted!", ephemeral: true });
  });

  return new Promise((resolve) => {
    buttonCollector.on("end", async (collected) => {
      const correctQuote = quotes.find(
        (quote) => quote.quoteName === correctAnswer
      );
      const results = Object.entries(answers).map(([userId, answer]) => ({
        userId,
        correct:
          answer === correctAnswer && correctQuote.category === randomCategory,
      }));

      results.forEach((result) => {
        if (result.correct) {
          playerScores[result.userId]++;
        }
      });

      await interaction.followUp(
        `Round ${round} Results:\n` +
          `<@${interaction.user.id}>: ${
            results.find((r) => r.userId === interaction.user.id)?.correct
              ? "Correct"
              : "Incorrect"
          }\n` +
          `<@${opponent.id}>: ${
            results.find((r) => r.userId === opponent.id)?.correct
              ? "Correct"
              : "Incorrect"
          }\n` +
          `The correct answer was: ${correctAnswer}`
      );

      resolve();
    });
  });
}

async function updateTriviaStats(player1Id, player2Id, winnerId, rounds) {
  const updatePromises = [player1Id, player2Id].map(async (playerId) => {
    const update = {
      $inc: {
        matches: 1,
        rounds: rounds,
      },
    };

    if (winnerId === playerId) {
      update.$inc.wins = 1;
    } else if (winnerId !== null) {
      update.$inc.losses = 1;
    }

    return TriviaSchema.findOneAndUpdate({ userID: playerId }, update, {
      upsert: true,
      new: true,
    });
  });

  await Promise.all(updatePromises);
}
