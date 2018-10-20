const Discord = require('discord.js');

exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  if (client.config.musicEnabled !== 'true') return message.channel.send('Music commands are disabled');
  const serverQueue = client.musicQueue.get(message.guild.id);
  if (!serverQueue) return message.channel.send('There is nothing playing.');
  const embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle('Now Playing')
    .setDescription(serverQueue.songs[0].title)
    .setFooter(client.user.username, client.user.avatarURL);
  return message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'np',
  category: 'Music',
  description: 'Check what song is playing.',
  usage: 'np',
};
