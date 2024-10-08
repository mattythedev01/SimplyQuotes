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
      const commandsDirectory = path.join(__dirname, "../");
      const commandFiles = fs
        .readdirSync(commandsDirectory, { withFileTypes: true })
        .flatMap((dirent) => {
          if (dirent.isDirectory()) {
            return fs
              .readdirSync(path.join(commandsDirectory, dirent.name))
              .map((file) => ({ file, folder: dirent.name }));
          }
          return { file: dirent.name, folder: null };
        })
        .filter((dirent) => dirent.file.endsWith(".js"))
        .map((dirent) => {
          const commandName = dirent.file.replace(".js", "");
          const command = require(path.join(
            commandsDirectory,
            dirent.folder || "",
            dirent.file
          ));
          const description = command.data.description;
          return {
            name: `/${commandName}`,
            value: `${description} (Located in: ${dirent.folder || "root"})`,
            inline: true, // Set inline to true for each field
          };
        });

      const helpEmbed = new EmbedBuilder()
        .setColor("#4A5EAD")
        .setTitle("🌟 Help: Available Commands 🌟")
        .setDescription(
          "Below is a list of all commands you can use. Each command includes a brief description and its location within the project structure."
        )
        .addFields(commandFiles)
        .setFooter({
          text: `Total commands available: ${commandFiles.length}`,
          iconURL: interaction.user.displayAvatarURL(),
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
