const Discord = require('discord.js');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const pingEmbed = new Discord.RichEmbed()
    .setColor('#44d639')
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .addField('API Latency:', '**Calculating** ms', true)
    .addField('Bot Latency:', '**Calculating** ms', true);
  const msgPing = await message.channel.send(pingEmbed);

  const newPingEmbed = new Discord.RichEmbed()
    .setColor('#44d639')
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .addField('API Latency:', `**${Math.round(client.ping)}** ms 📶`, true)
    .addField('Bot Latency:', `**${msgPing.createdTimestamp - message.createdTimestamp}** ms 📶`, true);
  msgPing.edit(newPingEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'ping',
  category: 'Bot',
  description: 'Checks the ping for the bot and api.',
  usage: 'ping',
};
