# SimplyQuotes Installation Guide 📦

Follow these steps to set up the SimplyQuotes bot in your Discord server.

## Prerequisites ⚙️

Before you begin, ensure you have the following:

- **Node.js**: Version 16 or higher. You can download it from [Node.js Official Website](https://nodejs.org/).
- **Discord Account**: You need a Discord account to create and manage a bot.
- **Discord Server**: A server where you can invite your bot.

## Step-by-Step Installation 🛠️

### 1. Clone the Repository

Open your terminal and execute the following command to clone the repository:

```bash
git clone https://github.com/mattythedev01/SimplyQuotes.git
cd SimplyQuotes
```
### 2. Install Dependencies

Open the project directory in your terminal and execute the following command:

```bash
npm install
```
If that doesn't work than try:

```bash
npm install --force
```

### 3. Variables

In the root directory, rename `example.env` to `.env` and fill out the following:

```bash
DISCORD_TOKEN="https://discord.com/developers/applications"
MONGODB_URI="https://www.mongodb.com/" 
```

### 4. Run the bot 

Open the terminal in the root directory and execute the following command:

```bash
node .
```
