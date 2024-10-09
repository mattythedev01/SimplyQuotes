const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays all available commands and their details.")
    .toJSON(),
  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      // Read command files from each command folder and generate command list
      const commandFolders = fs.readdirSync(
        path.join(__dirname, "../../commands")
      );
      let commandsList = [];
      commandFolders.forEach((folder) => {
        const commandFiles = fs
          .readdirSync(path.join(__dirname, "../../commands", folder))
          .filter((file) => file.endsWith(".js"));
        commandsList = commandsList.concat(
          commandFiles.map((file) => file.slice(0, -3))
        );
      });
      const commandsString = commandsList
        .map((command) => `\`${command}\``)
        .join("\n");

      // Load tips from tip.json
      const tips = require("../../tip.json").tips;
      const randomTip = tips[Math.floor(Math.random() * tips.length)];

      const helpEmbed = new EmbedBuilder()
        .setColor("#5865F2") // Discord Blurple
        .setTitle("🌟 Help: All Commands 🌟")
        .setDescription(`Explore the commands you can use!`)
        .addFields(
          {
            name: "Commands",
            value: commandsString || "No commands available.",
            inline: true,
          },
          {
            name: "How to use",
            value: "Type `/command` for more details on each command.",
            inline: true,
          }
        )
        .setFooter({
          text: randomTip,
        })
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL());

      await interaction.reply({ embeds: [helpEmbed], ephemeral: false });
    } catch (err) {
      console.error("[ERROR] Error in the help command run function:", err);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
