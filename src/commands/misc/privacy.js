const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("View the bot's privacy policy")
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const privacyEmbed = new EmbedBuilder()
      .setColor("#4A5EAD")
      .setTitle("🔒 Privacy Policy")
      .setDescription(
        "Your privacy is important to us. Here's how we handle your data:"
      )
      .addFields(
        {
          name: "Data Collection",
          value:
            "We collect minimal data, such as user IDs and command usage, to improve your experience.",
          inline: false,
        },
        {
          name: "Data Usage",
          value:
            "Data collected is only used to enhance bot functionality and is not shared with third parties.",
          inline: false,
        },
        {
          name: "Data Retention",
          value:
            "Data is stored securely and is deleted upon user request or after discontinuing use of the bot.",
          inline: false,
        },
        {
          name: "More Information",
          value:
            "For more detailed information, please visit our full privacy policy on our website.",
          inline: false,
        }
      )
      .setFooter({
        text: `📅 Updated as of now`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [privacyEmbed],
      ephemeral: true, // Making the reply ephemeral so it's only visible to the user who requested it
    });
  },
};
