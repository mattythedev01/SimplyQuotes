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

      let currentPage = -1; // Start with -1 to represent the category page

      const generateCategoryEmbed = () => {
        const categoriesString = commandFolders
          .map(
            (folder, index) =>
              `> **${index + 1}. ${
                folder.charAt(0).toUpperCase() + folder.slice(1)
              }**`
          )
          .join("\n");

        // Load tips from tip.json
        const tips = require("../../tip.json").tips;
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        return new EmbedBuilder()
          .setColor("#4B0082") // Indigo color for a more sophisticated look
          .setTitle("📚 SimplyQuotes Command Compendium")
          .setDescription(
            "Welcome, seeker of wisdom! 🌟\n\nEmbark on a journey through the realms of SimplyQuotes. Each category below is a treasure trove of inspiration and knowledge. What intellectual adventure shall we undertake today?"
          )
          .addFields(
            {
              name: "🔍 Explore Categories",
              value:
                categoriesString ||
                "Our categories are currently on a philosophical retreat. Check back soon!",
              inline: false,
            },
            {
              name: "💡 Wisdom of the Moment",
              value: `*"${randomTip}"*`,
              inline: false,
            }
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter({
            text: "SimplyQuotes - Enlightening minds, one command at a time",
          })
          .setTimestamp();
      };

      const generateHelpEmbed = (page) => {
        const folder = commandFolders[page];
        const commands = commandsByFolder[folder];
        const commandsString = commands
          .map((command) => `\`/${command}\``)
          .join("\n");

        // Load tips from tip.json
        const tips = require("../../tip.json").tips;
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        return new EmbedBuilder()
          .setColor("#FFD700") // Gold color
          .setTitle(
            `${folder.charAt(0).toUpperCase() + folder.slice(1)} Commands`
          )
          .setDescription(
            `Here are all the commands in the ${folder} category:`
          )
          .addFields({
            name: "Commands",
            value: commandsString || "No commands available.",
          })
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter({
            text: `Tip: ${randomTip}`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();
      };

      const generateButtons = () => {
        const buttons = commandFolders.map((folder, index) =>
          new ButtonBuilder()
            .setCustomId(`category_${index}`)
            .setLabel(folder.charAt(0).toUpperCase() + folder.slice(1))
            .setStyle(ButtonStyle.Secondary)
        );

        const homeButton = new ButtonBuilder()
          .setCustomId("home")
          .setLabel("🏠 Home")
          .setStyle(ButtonStyle.Primary);

        buttons.unshift(homeButton);

        return buttons;
      };

      const initialEmbed = generateCategoryEmbed();
      const buttons = generateButtons();

      const rows = [];
      for (let i = 0; i < buttons.length; i += 5) {
        rows.push(
          new ActionRowBuilder().addComponents(buttons.slice(i, i + 5))
        );
      }

      const message = await interaction.reply({
        embeds: [initialEmbed],
        components: rows,
        ephemeral: false,
      });

      const collector = message.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "home") {
          currentPage = -1;
          await i.update({
            embeds: [generateCategoryEmbed()],
            components: rows,
          });
        } else if (i.customId.startsWith("category_")) {
          currentPage = parseInt(i.customId.split("_")[1]);
          const updatedHelpEmbed = generateHelpEmbed(currentPage);
          await i.update({
            embeds: [updatedHelpEmbed],
            components: rows,
          });
        }
      });

      collector.on("end", async () => {
        for (const row of rows) {
          for (const button of row.components) {
            button.setDisabled(true);
          }
        }

        await interaction.editReply({
          components: rows,
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
