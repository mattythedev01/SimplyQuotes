const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const approveDenySchema = require("../../schemas/approveDenySchema");
const userSchema = require("../../schemas/userSchema");
const quoteSetupSchema = require("../../schemas/quoteSetupsSchema");
const quoteSchema = require("../../schemas/qoutesSchema");
const streaksSchema = require("../../schemas/streaksSchema");
const mConfig = require("../../messageConfig.json");
const tips = require("../../tip.json");
const badges = require("../../badges.json");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-quote")
    .setDescription("Add a quote to the system")
    .addStringOption((o) =>
      o
        .setName("category")
        .setDescription("Category for the quote.")
        .setRequired(true)
        .addChoices([
          { name: "Mental Health", value: "Mental Health" },
          { name: "Motivation", value: "Motivation" },
          { name: "Humor", value: "Humor" },
          { name: "Inspirational", value: "Inspirational" },
          { name: "Love", value: "Love" },
          { name: "Friendship", value: "Friendship" },
        ])
    )
    .addStringOption((o) =>
      o.setName("quote").setDescription("The quote to add.").setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId } = interaction;
    const category = options.getString("category");
    const quote = options.getString("quote");
    const userID = interaction.user.id;

    const randomTip = tips.tips[Math.floor(Math.random() * tips.tips.length)];

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - SimplyQuote | Tip: ${randomTip}`,
    });

    const quoteSetup = await quoteSetupSchema.findOne({ guildID: guildId });
    if (!quoteSetup) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`❌ This guild does not have the quote system setup.`);
      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }

    const quoteID = uuidv4().slice(0, 12);

    // Update or create user in userSchema
    let user = await userSchema.findOne({ userID: userID });
    if (!user) {
      user = new userSchema({
        userID: userID,
        numberOfQuotes: 1,
        TotalRatings: 0,
        streaks: 1,
        AuthorizedStaff: false,
        DmAuthorized: null,
        Authorized: true,
        Badges: ["None"],
        TosAgreement: false,
      });
    } else {
      user.numberOfQuotes += 1;
    }

    // Update or create streak in streaksSchema
    let streak = await streaksSchema.findOne({ userID: userID });
    const now = new Date();
    if (!streak) {
      streak = new streaksSchema({
        userID: userID,
        Streaks: 1,
        StreakLast: now,
      });
    } else {
      const timeDiff = now - streak.StreakLast;
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        streak.Streaks = 1;
        streak.StreakLast = now;
      } else {
        streak.Streaks += 1;
        streak.StreakLast = now;
      }
    }

    user.streaks = streak.Streaks;

    // Check if user has reached 10 TotalRatings within 90 hours and add the Ongoingstreak badge
    const ninetyHoursAgo = new Date(now.getTime() - 90 * 60 * 60 * 1000);
    const recentQuotes = await quoteSchema.find({
      userID: userID,
      createdAt: { $gte: ninetyHoursAgo },
    });

    const totalRecentRatings = recentQuotes.reduce(
      (sum, quote) => sum + quote.rating,
      0
    );

    if (totalRecentRatings >= 10 && !user.Badges.includes("Ongoingstreak")) {
      user.Badges = user.Badges.filter((badge) => badge !== "None");
      user.Badges.push("Ongoingstreak");
    }

    await user.save();
    await streak.save();

    if (user.AuthorizedStaff) {
      // If user is authorized staff, add quote directly to quoteSchema
      const newQuote = new quoteSchema({
        userID: userID,
        quoteID: quoteID,
        category: category,
        quoteName: quote,
        rating: 0,
      });
      await newQuote.save();

      rEmbed
        .setColor(mConfig.embedColorSuccess)
        .setDescription(
          `✅ Quote added successfully. Your streak is ${streak.Streaks}!`
        );
      await interaction.reply({ embeds: [rEmbed], ephemeral: true });
    } else {
      // If user is not authorized staff, store quote in approveDenySchema
      const newQuote = new approveDenySchema({
        userId: userID,
        quoteId: quoteID,
        category: category,
        quoteName: quote,
        rating: 0,
      });
      await newQuote.save();

      rEmbed
        .setColor(mConfig.embedColorSuccess)
        .setDescription(
          `✅ Quote waiting for review & approval by devs. Your streak is ${streak.Streaks}!`
        );
      await interaction.reply({ embeds: [rEmbed], ephemeral: true });

      const devChannel = await client.channels.fetch("1290033222700240987");
      if (devChannel) {
        devChannel.send({
          content: `New quote submitted by <@${userID}> for review: "${quote}" (ID: ${quoteID})`,
        });
      }
    }

    // Ask user about DM notifications only if DmAuthorized is null
    if (user.DmAuthorized === null) {
      await interaction.followUp({
        content:
          "Would you like to be notified in the DMs by me if your quote has been approved? [Y/n]",
        ephemeral: true,
      });

      const filter = (m) => m.author.id === userID;
      try {
        const collected = await interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 30000,
          errors: ["time"],
        });

        const response = collected.first().content.toLowerCase();
        if (["y", "yes"].includes(response)) {
          user.DmAuthorized = true;
          await user.save();
          await interaction.followUp({
            content:
              "Great! You'll receive DM notifications for approved quotes.",
            ephemeral: true,
          });
        } else if (["n", "no"].includes(response)) {
          user.DmAuthorized = false;
          await user.save();
          await interaction.followUp({
            content:
              "Understood. You won't receive DM notifications for approved quotes.",
            ephemeral: true,
          });
        } else {
          await interaction.followUp({
            content:
              "Invalid response. Your DM notification settings remain unchanged.",
            ephemeral: true,
          });
        }
      } catch (error) {
        await interaction.followUp({
          content:
            "No response received. Your DM notification settings remain unchanged.",
          ephemeral: true,
        });
      }
    }
  },
};
