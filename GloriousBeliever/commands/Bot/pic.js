// const Discord = require('discord.js');

exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  message.channel.send('some text', {
    file: 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-477559.png', // Or replace with FileOptions object
  });

  const cmdAction = args.shift();
  // if (!cmdAction || cmdAction !== 'add' || 'remove' || 'list') return message.channel.send('Use add, remove or list');

  if (cmdAction === 'add') {
    const pictureLink = args.shift();
    if (!pictureLink) return message.channel.send('Please use: pics add <Picture link> <Name>');
    const pictureName = args.join(' ');
    if (!pictureName) return message.channel.send('Please use: pics add <Picture link> <Name>');

    sql.run('INSERT INTO pictureMaster (guildID, userID, pictureLink, pictureName) VALUES (?,?,?,?)', [message.guild.id, message.author.id, pictureLink, pictureName]);
    message.channel.send(`${pictureName} has been added to picture list.`);
  } else if (cmdAction === 'remove') {
    const pictureName = args.join(' ');
    if (!pictureName) return message.channel.send('Please use: pics remove <Name>');

    sql.run(`DELETE FROM pictureMaster WHERE pictureName="${pictureName}" AND guildID=${message.guild.id}`);
    message.channel.send(`${pictureName} has been removed from picture list.`);
  } else if (cmdAction === 'list') {
    sql.all(`SELECT * FROM pictureMaster WHERE guildID=${message.guild.id}`).then((rows) => {
      if (rows.length === 0) {
        return message.channel.send('There is no pictures in database');
      }
      const rowNames = rows.map(row => `${row.pictureName} : ${row.pictureLink} : ${row.userID}`);
      return message.channel.send(`\`\`\`Picture Name : Picture Link : User ID \n ${rowNames.join('\n')}\`\`\``);
    });
  } else {
    message.channel.send('Use pic <add, remove or list>');
  }
  return true;
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: 'Server Owner',
};

exports.help = {
  name: 'pic',
  category: 'Bot',
  description: 'Shows a picture.',
  usage: 'pic <add/remove/list> <link> <name>',
};
