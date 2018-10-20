const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
  const bicon = client.user.displayAvatarURL;
  const embed = new Discord.RichEmbed()
    .setAuthor('GloriousBot v1', bicon)
    .setColor(client.config.defaultSettings.white)
    .setThumbnail(bicon)
    .addField('Bot Name', `🤖 ${client.user.username}`, true)
    .addField('Bot Owner', '👑 GloriousBeliever#4701', true)
    .addField('Servers', `🛡 ${client.guilds.size}`, true)
    .addField('Channels', `📁 ${client.channels.size}`, true)
    .addField('Users', `👤 ${client.users.size}`, true)
    .addField('Uptime', `⏰ ${duration}`, true)
    .addField('Created on', client.user.createdAt.toString().slice(0, 24))
    .setFooter('Developed by: Pengu:6047');
  message.channel.send({ embed });
};


exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'info',
  category: 'Bot',
  description: 'Shows bot information.',
  usage: 'info',
};
