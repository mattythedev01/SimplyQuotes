const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const quoteSetupSchema = require("../../schemas/quoteSetupsSchema");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote-setup")
    .setDescription("Configure the quote system")
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("The channel for quotes.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption((o) =>
      o
        .setName("role")
        .setDescription("The role to ping for quotes.")
        .setRequired(false)
    )
    .addBooleanOption((o) =>
      o
        .setName("qotd")
        .setDescription("Enable quote of the day.")
        .setRequired(false)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId } = interaction;
    const role = options.getRole("role");
    const channel = options.getChannel("channel");
    const quoteOfTheDayEnabled = options.getBoolean("qotd");

    const rEmbed = new EmbedBuilder().setFooter({
      iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
      text: `${client.user.username} - SimplyQuote`,
    });

    let data = await quoteSetupSchema.findOne({ guildID: guildId });
    if (data) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`❌ This guild already has the quote setup completed.`);
      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }

    data = new quoteSetupSchema({
      guildID: guildId,
      roleID: role ? role.id : null,
      channelID: channel.id,
      quoteOfTheDay: quoteOfTheDayEnabled,
    });
    await data.save();
    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(
        `✅ Successfully set the quote channel to ${channel}!` +
          (role ? ` Quote ping role set to ${role}.` : "") +
          (quoteOfTheDayEnabled
            ? ` Quote of the day enabled.`
            : " Quote of the day disabled.")
      );
    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
