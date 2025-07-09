const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('@distube/ytdl-core');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'Put Your Bot Token Here';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

// Listen for the "/start" command
bot.onText(/\/start/, (msg) => {    
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Welcome! I am your bot. How can I assist you today?');
});

// Listen for the "/help" command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat with help information
  bot.sendMessage(chatId, 'Here are some commands you can use:\n' +
                          '/echo [message] - Echoes back your message\n' +
                          '/start - Starts the bot\n' +
                          '/help - Shows this help message');
}); 
// Listen for the "/stop" command
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Goodbye! I will stop responding now.');
  bot.stopPolling(); // Stop the bot from polling for new messages
});
// Handle errors
bot.on("polling_error", (error) => {
  console.error("Polling error:", error.code); // => 'EFATAL'
}); 

// youtube download
bot.onText(/\/download (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  try {
    if (!ytdl.validateURL(url)) {
      bot.sendMessage(chatId, 'Invalid YouTube URL. Please provide a valid link.');
      return;
    }

    bot.sendMessage(chatId, 'Downloading video...');

    const stream = ytdl(url, { quality: 'highest' });
    stream.on('error', (error) => {
      bot.sendMessage(chatId, 'Error downloading video: ' + error.message);
    });

    bot.sendVideo(chatId, stream, { caption: 'Here is your video!' });
  } catch (error) {
    bot.sendMessage(chatId, 'An error occurred: ' + error.message);
  }
});
