const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
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
      const commandFolders = fs
        .readdirSync(path.join(__dirname, "../../commands"))
        .filter((folder) => folder !== "developer");
      const commandsByFolder = {};
      commandFolders.forEach((folder) => {
        const commandFiles = fs
          .readdirSync(path.join(__dirname, "../../commands", folder))
          .filter((file) => file.endsWith(".js"));
        commandsByFolder[folder] = commandFiles.map((file) =>
          file.slice(0, -3)
        );
      });

      let currentPage = 0;
      const totalPages = commandFolders.length;

      const generateHelpEmbed = (page) => {
        const folder = commandFolders[page];
        const commands = commandsByFolder[folder];
        const commandsString = commands
          .map((command) => `\`/${command}\``)
          .join("\n");

        // Load tips from tip.json
        const tips = require("../../tip.json").tips;
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        const helpEmbed = new EmbedBuilder()
          .setColor("#FFD700") // Gold color
          .setTitle(`✨ ${folder.toUpperCase()} COMMANDS ✨`)
          .setDescription(
            "Explore the amazing commands SimplyQuotes has to offer!"
          )
          .addFields({
            name: "📜 Available Commands",
            value: commandsString || "No commands available.",
          })
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter({
            text: `Page ${
              page + 1
            } of ${totalPages} | 💡 Pro Tip: ${randomTip}`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        return helpEmbed;
      };

      const helpEmbed = generateHelpEmbed(currentPage);

      const prevButton = new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("◀️ Previous")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 0);

      const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next ▶️")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === totalPages - 1);

      const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

      const message = await interaction.reply({
        embeds: [helpEmbed],
        components: [row],
        ephemeral: false,
      });

      const collector = message.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "prev") {
          currentPage--;
        } else if (i.customId === "next") {
          currentPage++;
        }

        const updatedHelpEmbed = generateHelpEmbed(currentPage);
        prevButton.setDisabled(currentPage === 0);
        nextButton.setDisabled(currentPage === totalPages - 1);

        await i.update({
          embeds: [updatedHelpEmbed],
          components: [row],
        });
      });

      collector.on("end", async () => {
        prevButton.setDisabled(true);
        nextButton.setDisabled(true);

        await interaction.editReply({
          components: [row],
        });
      });
    } catch (err) {
      console.error("[ERROR] Error in the help command run function:", err);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
