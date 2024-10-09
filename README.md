# SimplyQuotes 🤖✨

Welcome to **SimplyQuotes**, a global community quoting bot for Discord. The bot is designed to help you share, retrieve, and discover quotes seamlessly within your Discord servers! 🌟

## Features 🌈

- **Quote Management**: Add, edit, and view quotes easily.
- **Random Quotes**: Get a random quote with a simple command.
- **Search Quotes**: Find specific quotes by keywords or author.
- **User-Friendly Commands**: Intuitive command structure for easy access.
- **Community Contributions**: Allow users to suggest new quotes!

## Table of Contents 📚

- [Installation](https://github.com/mattythedev01/SimplyQuotes/blob/main/installation.md)
- [License](https://github.com/mattythedev01/SimplyQuotes/blob/main/LICENSE)
- [Support](https://discord.gg/4zaaRkTPZE)

## Installation 🛠️

### Prerequisites

Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- A Discord account
- A Discord server where you can add the bot

### Steps

1. Clone this repository:
    ```bash
    git clone https://github.com/mattythedev01/SimplyQuotes.git
    cd SimplyQuotes
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Rename `example.env` to `.env` in the root directory and add your Discord Bot Token & MongoDB String:
    ```
    DISCORD_TOKEN="token",
    MONGODB_URI="string"
    ```

4. Run the bot:
    ```bash
    node .
    ```

## Usage 💬

Simply invite the bot to your server and start sharing and exploring amazing quotes! Ensure to check permissions to allow the bot to read and send messages.

## Database 📦

In SimplyQuotes, when a user submits a new quote, it will go through an approval process before being added to the database. Once added to the database, your quote can be picked to be sent to quote channels across Discord.

### Approval Process

1. **Submission**: Users can submit new quotes for review.
2. **Moderation**: A designated moderator will review the submitted quotes.
3. **Approval**: Once approved, the quote will be added to the database.
4. **Global Visibility**: Approved quotes will then be available to be visible to every quote channel that was setup using the bot.

This ensures that the content shared within SimplyQuotes is curated and maintains a standard of quality.

## Contributing 🤝

We welcome contributions! If you want to improve SimplyQuotes, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💖

If you encounter any issues or have any questions, feel free to open an issue in the repository. We appreciate your feedback! (Or [Join the Discord server](https://discord.gg/4zaaRkTPZE)

---

Thank you for using SimplyQuotes! May your quotes motivate others! 💬✨
