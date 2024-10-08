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
    .setName("edit-setup")
    .setDescription("Edit the existing quote system setup")
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("The new channel for quotes.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addRoleOption((o) =>
      o
        .setName("role")
        .setDescription("The new role to ping for quotes.")
        .setRequired(false)
    )
    .addBooleanOption((o) =>
      o
        .setName("qotd")
        .setDescription("Enable or disable quote of the day.")
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
    if (!data) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`❌ No existing setup found for this guild.`);
      interaction.reply({ embeds: [rEmbed], ephemeral: true });
      return;
    }

    if (channel) {
      data.channelID = channel.id;
    }
    if (role) {
      data.roleID = role.id;
    }
    if (quoteOfTheDayEnabled !== null) {
      data.quoteOfTheDay = quoteOfTheDayEnabled;
    }

    await data.save();
    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(
        `✅ Successfully updated the quote setup.` +
          (channel ? ` Channel set to ${channel}.` : "") +
          (role ? ` Role set to ${role}.` : "") +
          (quoteOfTheDayEnabled !== null
            ? ` Quote of the Day enabled: ${quoteOfTheDayEnabled}.`
            : "")
      );
    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
