const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const userSchema = require("../../schemas/userSchema");

module.exports = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const user = await userSchema.findOne({ userID: interaction.user.id });

    if (!user || !user.TosAgreement) {
      const tosEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("SimplyQuotes Terms of Service")
        .setDescription(
          "Please read and accept our Terms of Service before using SimplyQuotes."
        )
        .addFields(
          {
            name: "1. Quote Submission",
            value:
              "By submitting quotes, you confirm that you have the right to share them and grant SimplyQuotes permission to use and display them.",
          },
          {
            name: "2. Content Guidelines",
            value:
              "Quotes must not contain explicit, offensive, or copyrighted material. SimplyQuotes reserves the right to remove any quote that violates these guidelines.",
          },
          {
            name: "3. User Responsibility",
            value:
              "Users are responsible for the content they submit. SimplyQuotes is not liable for any submitted content.",
          },
          {
            name: "4. Moderation",
            value:
              "SimplyQuotes may moderate, edit, or remove quotes at its discretion to maintain quality and appropriateness.",
          },
          {
            name: "5. Privacy",
            value:
              "We respect your privacy. Please refer to our Privacy Policy for details on how we handle user data.",
          },
          {
            name: "6. Changes to ToS",
            value:
              "SimplyQuotes may update these terms. Users will be notified of any significant changes.",
          }
        )
        .setFooter({
          text: "By clicking 'I accept', you agree to abide by these terms.",
        });

      const acceptButton = new ButtonBuilder()
        .setCustomId("accept_tos")
        .setLabel("I accept")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(acceptButton);

      await interaction.reply({
        embeds: [tosEmbed],
        components: [row],
        ephemeral: true,
      });

      const filter = (i) =>
        i.customId === "accept_tos" && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "accept_tos") {
          await userSchema.findOneAndUpdate(
            { userID: interaction.user.id },
            { $set: { TosAgreement: true } },
            { upsert: true, new: true }
          );

          await i.update({
            content:
              "You have accepted the Terms of Service. You can now use SimplyQuotes commands.",
            embeds: [],
            components: [],
            ephemeral: true,
          });
        }
      });

      return;
    }

    // If TosAgreement is true, allow the command to proceed
    try {
      if (!client.commands) {
        console.error("client.commands is undefined");
        await interaction.reply({
          content:
            "There was an error while executing this command. The bot is not fully initialized.",
          ephemeral: true,
        });
        return;
      }

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`Command not found: ${interaction.commandName}`);
        await interaction.reply({
          content: "This command doesn't exist.",
          ephemeral: true,
        });
        return;
      }
      await command.run(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });
};
