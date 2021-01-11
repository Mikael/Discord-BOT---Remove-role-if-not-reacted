const { Client, Collection } = require('discord.js');
const { token, prefix } = require('./config.js');
const fs = require('fs');

const bot = new Client({ partials: ['USER', 'MESSAGE', 'GUILD_MEMBER', 'CHANNEL', 'REACTION'] });
let role = JSON.parse(fs.readFileSync('./role.json', 'utf8'));

bot.once('ready', async () => {
  console.log('Bot is now Running!');
});

bot.on('message', async (message) => {
    userMessage = message.content;
    let msgArr = message.content.toLowerCase().split(' ');
    switch (msgArr[0]) {
      case `${prefix}check`: {
        if (role.current) {
          let currentRole = message.guild.roles.cache.get(role.current)
          if (currentRole) {
            let roleUsers = currentRole.members.array();
            const messageChannel = message.guild.channels.cache.get(msgArr[1]);
            if (messageChannel) {
              const currentMessage = await messageChannel.messages.fetch(msgArr[2])
              if (currentMessage) {
                const messageReactions = currentMessage.reactions.cache.get('👍');
                let userReactions
                if (messageReactions) {
                  await messageReactions.users.fetch();
                  userReactions = messageReactions.users.cache;
                }
                else
                  userReactions = new Collection;
                for (const user of roleUsers) {
                  const currentUser = userReactions.get(user.id);
                  if (!currentUser) {
                    user.roles.remove(role.current);
                  }
                }
                message.channel.send('Done');
              }
            }
          }
        }
        break;
      }
      case `${prefix}setrole`: {
        if (message.mentions.roles.first()) {
          role.current = message.mentions.roles.first().id;
          fs.writeFileSync('./role.json', JSON.stringify(role, null, 4));
        }
        break;
      }
      default: {
        break;
      }
    }
});

bot.login(token);