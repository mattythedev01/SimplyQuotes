const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const badges = require("../../badges.json").badges;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listbadges")
    .setDescription("Lists all available badges and how to obtain them.")
    .toJSON(),

  run: async (client, interaction) => {
    try {
      const badgeFields = badges.map((badge) => {
        let description = "No description available.";
        if (badge.name === "Staff") {
          description =
            "Awarded to staff members who work for Ghosty Development.";
        } else if (badge.name === "Ongoing streak") {
          description = "Awarded for uploading 1 quote per day for 5+ days.";
        }
        return {
          name: `${badge.emoji} ${badge.name}`,
          value: description,
          inline: true,
        };
      });

      const embed = new EmbedBuilder()
        .setColor("#FFD700") // Gold color
        .setTitle("🏆 SimplyQuotes Badge Collection 🏆")
        .setDescription(
          "Discover the exclusive badges you can earn on your SimplyQuotes journey!"
        )
        .addFields(badgeFields)
        .setThumbnail(
          client.user.displayAvatarURL({ dynamic: true, size: 256 })
        )
        .setFooter({ text: "Collect them all and showcase your achievements!" })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: false,
      });
    } catch (err) {
      console.error("[ERROR] Error in the listbadges command:", err);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
