require('dotenv').config({ path: './auth.env' });

const tmi = require('tmi.js');
const discord = require('discord.js');
const fs = require('fs');

const discordClient = new discord.Client();
const twitchClient = new tmi.Client({
  options: { debug: false },
  connection: { reconnect: true, secure: true },
  identity: {
    username: 'channel name here ! ',
// the username and channels is the name of your twitch channel and password is a oath code that u can obtain
// here : https://twitchapps.com/tmi/
    password: 'your oath here ! ',
  },
  channels: [' channel name here ! '],
});

// add words that u want filter
const filteredWords = ['exemple1', 'exemple2', 'add as many as you want' ];

// your discord bot token here 
discordClient.login(' Your discord bot token here ! ');
twitchClient.connect();

discordClient.on('ready', () => {
  console.log('Discord started.');
});

twitchClient.on('connected', () => {
  console.log('Twitch started.');
});

let messageCount = 0;
const messageLimit = 1;

twitchClient.on('message', async (channel, user, message, self) => {
  if (self) return;

  messageCount++;

  if (messageCount % messageLimit !== 0) {
    return;
  }


  const discordChannel = discordClient.channels.cache.get('Channel id here !'); // ID du salon Discord

  let filteredMessage = message;

  filteredWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (filteredMessage.match(regex)) {
      filteredMessage = '**filtered**';
      return;
    }
  });

  const messageContent = `${user['display-name']}: ${filteredMessage}`;

  discordChannel.send(messageContent);
  console.log(`Message sent to Discord: ${messageContent}`);
});

twitchClient.on('ban', async (channel, username, reason) => {
  const discordChannel = discordClient.channels.cache.get('1121042632752234526'); // ID du salon Discord

  const messageContent = `**${username} a été bannis**`;

  discordChannel.send(messageContent);
  console.log(`Message sent to Discord: ${messageContent}`);
});

twitchClient.on('timeout', async (channel, username, reason, duration) => {
  const discordChannel = discordClient.channels.cache.get('1121042632752234526'); // ID du salon Discord

  const messageContent = `**${username} a été timeout ${duration} seconds.**`;

  discordChannel.send(messageContent);
  console.log(`Message sent to Discord: ${messageContent}`);
});

process.on('SIGINT', () => {
  process.exit();
});