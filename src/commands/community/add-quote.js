const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const userSchema = require("../../schemas/userSchema");
const approveDenySchema = require("../../schemas/approveDenySchema");
const quoteSetupSchema = require("../../schemas/quoteSetupsSchema");
const mConfig = require("../../messageConfig.json");
const { v4: uuidv4 } = require("uuid"); // Import UUID to generate quoteId

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
    const userId = interaction.user.id;

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - SimplyQuote`,
    });

    // Check if the guild has a quote setup
    const quoteSetup = await quoteSetupSchema.findOne({ guildID: guildId });
    if (!quoteSetup) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`❌ This guild does not have the quote system setup.`);
      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }

    // Generate a unique 12 character ID for the quote
    const quoteId = uuidv4().slice(0, 12);

    // Log the category, userId, and quoteId to the user schema
    const userUpdate = new userSchema({
      userID: userId,
      quoteID: quoteId, // Log the unique quote ID
      quoteName: "None yet", // Set quoteName to "None yet" as per instruction
      category: category,
      createdAt: new Date(), // Log the time and date when the category was added
    });
    await userUpdate.save();

    // Log the quote and userId to the approveDeny schema
    const quoteEntry = new approveDenySchema({
      quoteId: quoteId,
      quoteName: quote,
      userId: userId, // Log the userId of who made quoteName to the approveDeny schema
    });
    await quoteEntry.save();

    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(`✅ Quote waiting for review & approval by devs`);
    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
