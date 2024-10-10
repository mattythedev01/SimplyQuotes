module.exports = async (client) => {
  const colors = await import("colors");
  const { Octokit } = await import("@octokit/rest");
  const { EmbedBuilder } = await import("discord.js");

  const octokit = new Octokit();

  const owner = "mattythedev01";
  const repo = "SimplyQuotes";

  let lastCheckedEvents = {
    Issue: null,
    Star: null,
    Fork: null,
    PullRequest: null,
  };

  async function checkGithubEvents() {
    try {
      const issues = await octokit.issues.listForRepo({
        owner,
        repo,
        state: "all",
        per_page: 1,
      });
      const stars = await octokit.activity.listStargazersForRepo({
        owner,
        repo,
        per_page: 1,
      });
      const forks = await octokit.repos.listForks({
        owner,
        repo,
        per_page: 1,
      });
      const pulls = await octokit.pulls.list({
        owner,
        repo,
        state: "all",
        per_page: 1,
      });

      const events = [
        { type: "Issue", data: issues.data[0], color: "#ff9800", emoji: "🐛" },
        { type: "Star", data: stars.data[0], color: "#ffd700", emoji: "⭐" },
        { type: "Fork", data: forks.data[0], color: "#4caf50", emoji: "🍴" },
        {
          type: "PullRequest",
          data: pulls.data[0],
          color: "#2196f3",
          emoji: "🔀",
        },
      ];

      for (const event of events) {
        if (
          event.data &&
          new Date(event.data.created_at) > new Date(Date.now() - 60000) &&
          event.data.created_at !== lastCheckedEvents[event.type]
        ) {
          lastCheckedEvents[event.type] = event.data.created_at;

          const embed = new EmbedBuilder()
            .setColor(event.color)
            .setTitle(`${event.emoji} New ${event.type} on SimplyQuotes`)
            .setURL(`https://github.com/${owner}/${repo}`)
            .setDescription(
              `A new ${event.type.toLowerCase()} has been ${
                event.type === "Star" ? "added to" : "opened on"
              } the repository.`
            )
            .addFields(
              {
                name: "👤 User",
                value: `[${event.data.user.login}](${event.data.user.html_url})`,
                inline: true,
              },
              { name: "🔧 Action", value: event.type, inline: true }
            )
            .setThumbnail(event.data.user.avatar_url)
            .setFooter({
              text: `SimplyQuotes GitHub Activity`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          if (event.type === "Issue" || event.type === "PullRequest") {
            embed.addFields({
              name: "📝 Title",
              value: `[${event.data.title}](${event.data.html_url})`,
            });
            if (event.data.body) {
              embed.addFields({
                name: "📄 Description",
                value:
                  event.data.body.length > 100
                    ? event.data.body.substring(0, 100) + "..."
                    : event.data.body,
              });
            }
          }

          if (event.type === "Fork") {
            embed.addFields({
              name: "🔱 Forked Repository",
              value: `[${event.data.full_name}](${event.data.html_url})`,
            });
          }

          const channel = await client.channels.fetch("1290153199713648660");
          if (channel) {
            await channel.send({ embeds: [embed] });
          }
        }
      }
    } catch (error) {
      console.error("Error checking GitHub events:".red, error);
    }
  }

  // Check for events every minute
  setInterval(checkGithubEvents, 5 * 60 * 60 * 1000);

  console.log("[INFO]".blue + " GitHub event listener started.");
};
