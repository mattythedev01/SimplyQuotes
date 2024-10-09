const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../schemas/userSchema');
const guildSchema = require('../../schemas/guildSchema');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Blacklist a user or guild')
    .addStringOption(option =>
      option.setName('user')
        .setDescription('The user ID to blacklist')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('guild')
        .setDescription('The guild ID to blacklist')
        .setRequired(false)
    ),
  run: async (client, interaction) => {
    if (!config.developersIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.getString('user');
    const targetGuildId = interaction.options.getString('guild'); // Guild ID

    if (!targetUser && !targetGuildId) {
      return interaction.reply({
        content: 'You must specify either a user ID or a guild ID to blacklist.',
        ephemeral: true,
      });
    }

    if (targetUser) {
      const userIdPattern = /^\d{17,19}$/;
      if (!userIdPattern.test(targetUser)) {
        return interaction.reply({
          content: 'Invalid user ID. Please provide a valid user ID.',
          ephemeral: true,
        });
      }

      const user = await userSchema.findOne({ userId: targetUser });
      if (!user) {
        return interaction.reply({
          content: 'User not found in the database.',
          ephemeral: true,
        });
      }

      user.isBlacklisted = true;
      await user.save();

      await interaction.reply({
        content: `Successfully blacklisted the user with ID ${targetUser}.`,
        ephemeral: true,
      });
    } else if (targetGuildId) {
      const guildIdPattern = /^\d{17,19}$/;
      if (!guildIdPattern.test(targetGuildId)) {
        return interaction.reply({
          content: 'Invalid guild ID. Please provide a valid guild ID.',
          ephemeral: true,
        });
      }

      const targetGuild = await client.guilds.fetch(targetGuildId).catch(() => null);
      if (targetGuild) {
        const guild = await guildSchema.findOne({ guildId: targetGuildId });
        if (!guild) {
          return interaction.reply({
            content: 'Guild not found in the database.',
            ephemeral: true,
          });
        }

        guild.isBlacklisted = true;
        await guild.save();

        await interaction.reply({
          content: `Successfully blacklisted the guild: ${targetGuild.name}.`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'Guild not found. Please provide a valid guild ID.',
          ephemeral: true,
        });
      }
    }
  },
};
