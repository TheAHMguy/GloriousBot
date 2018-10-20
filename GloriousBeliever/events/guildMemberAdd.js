// This event executes when a new member joins a server. Let's welcome them!
const Discord = require('discord.js');

module.exports = (client, member) => {
  // If welcome is off, don't proceed (don't welcome the user)
  if (client.config.defaultSettings.welcomeEnabled !== 'true') return;

  const changeFirst = client.config.defaultSettings.welcomeMessage.replace('{{user}}', member.user.tag);
  const welcomeMessage = changeFirst.replace('{{guild}}', member.guild.name);

  console.log(welcomeMessage);
  // ${member.user.tag} joined ${member.guild.name}

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  const uIcon = member.user.displayAvatarURL;
  const UEmbed = new Discord.RichEmbed()
    .setAuthor(welcomeMessage, uIcon)
    .setColor(client.config.defaultSettings.white)
    .setTimestamp()
    .setFooter('New User');
  member.guild.channels.find('name', client.config.defaultSettings.welcomeChannel).send(UEmbed).catch(console.error);
};
