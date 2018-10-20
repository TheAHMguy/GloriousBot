const Discord = require('discord.js');

exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  const bicon = client.user.displayAvatarURL;
  const embed = new Discord.RichEmbed()
    .setAuthor('GloriousBot', bicon)
    .setColor(client.config.defaultSettings.white)
    .addField('About', 'GloriousBot is a bot created by an Islamic organization known as "GloriousBeliever". This bot was originally created for muslim servers to use it. But soon(Insha\'Allah) we are planning more on this bot to be used by those who want to convert themselves into Islam. There are more coming on the next update so stay tuned. For the help center or support please Join below:\n<https://discord.gg/22Aq37Y>\n   ‍   ')
    .addField('In order to now more about GloriousBeliever or to join our community', 'Facebook Page: <https://www.facebook.com/GloriousBeliever-274155556666560/>\n\nFacebook Group: <https://www.facebook.com/groups/GloriousBeliever/?source_id=274155556666560>\n\nYouTube: <https://www.youtube.com/channel/UCSgDjbaSKeVwZIRJ4iNoWJw> \n\nInstagram(Newly created): <https://www.instagram.com/glorousbeliever/> \n\nDiscord: <https://discord.gg/22Aq37Y>\n   ‍   ')
    .addField('In order to support us', 'Patreon: <https://www.patreon.com/GloriousBeliever>\n\nPayPal: <https://www.paypal.com/pools/c/86ETTxTvJe>\n   ‍   ')
    .addField('Donating us $4? Then please don\'t forget to donate the half of your donation to the creator of this bot', 'PayPal: <https://www.paypal.me/devpengu>');
  return message.channel.send({ embed });
};


exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'about',
  category: 'Bot',
  description: 'Shows about information.',
  usage: 'about',
};
