const { ShardingManager } = require("discord.js");
const path = require("path");
require("dotenv").config();

const token = process.env.TOKEN;

if (!token) {
  console.error("Error: TOKEN is not set in the environment variables.");
  process.exit(1);
}

const manager = new ShardingManager(path.join(__dirname, "bot.js"), {
  token: token,
  totalShards: "auto",
});

manager.on("shardCreate", (shard) => {
  console.log(`Launched shard ${shard.id}`);
});

manager.spawn().catch((error) => {
  console.error("Failed to spawn shards:", error);
  process.exit(1);
});
