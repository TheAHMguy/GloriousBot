// const Discord = require('discord.js');

exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  const cmdAction = args.shift();
  // if (!cmdAction || cmdAction !== 'add' || 'remove' || 'list') return message.channel.send('Use add, remove or list');

  if (cmdAction === 'add') {
    const musicLink = args.shift();
    if (!musicLink) return message.channel.send('Please use: music add <Youtube link> <Name>');
    const musicName = args.join(' ');
    if (!musicName) return message.channel.send('Please use: music add <Youtube link> <Name>');

    sql.run('INSERT INTO musicMaster (guildID, userID, ytSong, songName) VALUES (?,?,?,?)', [message.guild.id, message.author.id, musicLink, musicName]);
    message.channel.send(`${musicName} has been added to playlist.`);
  } else if (cmdAction === 'remove') {
    const musicName = args.join(' ');
    if (!musicName) return message.channel.send('Please type music name');

    sql.run(`DELETE FROM musicMaster WHERE songName="${musicName}" AND guildID=${message.guild.id}`);
    message.channel.send(`${musicName} has been removed from playlist.`);
  } else if (cmdAction === 'list') {
    sql.all(`SELECT * FROM musicMaster WHERE guildID=${message.guild.id}`).then((rows) => {
      if (rows.length === 0) {
        return message.channel.send('There is no songs in database');
      }
      const rowNames = rows.map(row => `${row.songName} : ${row.ytSong} : ${row.userID}`);
      return message.channel.send(`\`\`\`Song Name : Youtube Link : User ID \n ${rowNames.join('\n')}\`\`\``);
    });
  } else {
    message.channel.send('Use add, remove or list');
  }
  return true;
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Server Owner',
};

exports.help = {
  name: 'music',
  category: 'Music',
  description: 'Music Controller.',
  usage: 'music <add/remove/list> <link> <name>',
};
