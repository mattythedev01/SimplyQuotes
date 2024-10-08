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
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],

  run: async (client, interaction) => {
    const { options, guildId } = interaction;
    const role = options.getRole("role");
    const channel = options.getChannel("channel");

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

    await data.save();
    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(
        `✅ Successfully updated the quote setup.` +
          (channel ? ` Channel set to ${channel}.` : "") +
          (role ? ` Role set to ${role}.` : "")
      );
    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
