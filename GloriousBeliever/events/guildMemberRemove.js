// This event executes when a new member joins a server. Let's welcome them!
const Discord = require('discord.js');
const sql = require('sqlite');

module.exports = (client, member) => {
  const { guild } = member;
  sql.run(`DELETE FROM userScores WHERE guildID=${guild.id} AND userID=${member.user.id}`);
  // Load the guild's settings

  // If welcome is off, don't proceed (don't welcome the user)
  if (client.config.defaultSettings.leaveEnabled !== 'true') return;

  const changeFirst = client.config.defaultSettings.leaveMessage.replace('{{user}}', member.user.tag);
  const leaveMessage = changeFirst.replace('{{guild}}', member.guild.name);

  // ${member.user.tag} left ${member.guild.name}
  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  const uIcon = member.user.displayAvatarURL;
  const UEmbed = new Discord.RichEmbed()
    .setAuthor(leaveMessage, uIcon)
    .setColor(client.config.defaultSettings.white)
    .setTimestamp()
    .setFooter('User left');
  member.guild.channels.find('name', client.config.defaultSettings.leaveChannel).send(UEmbed).catch(console.error);
};
