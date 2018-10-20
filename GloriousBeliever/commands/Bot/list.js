exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  const cmdAction = args.shift();

  if (cmdAction === 'nasheeds') {
    sql.all(`SELECT * FROM musicMaster WHERE guildID=${message.guild.id}`).then((rows) => {
      if (rows.length === 0) {
        return message.channel.send('There is no songs in database');
      }
      const rowNames = rows.map(row => `${row.songName}`);
      return message.channel.send(`\`\`\`Song Name: \n ${rowNames.join('\n')}\`\`\``);
    });
  } else if (cmdAction === 'dua') {
    const picName = args.join(' ');
    if (!picName) return message.channel.send('Please type pic name');

    sql.run(`DELETE FROM musicMaster WHERE songName="${picName}" AND guildID=${message.guild.id}`);
    message.channel.send(`${picName} has been removed from playlist.`);
  } else if (cmdAction === 'topics') {
    sql.all(`SELECT * FROM musicMaster WHERE guildID=${message.guild.id}`).then((rows) => {
      if (rows.length === 0) {
        return message.channel.send('There is no songs in database');
      }
      const rowNames = rows.map(row => `${row.songName} : ${row.ytSong} : ${row.userID}`);
      return message.channel.send(`\`\`\`Song Name : Youtube Link : User ID \n ${rowNames.join('\n')}\`\`\``);
    });
  } else {
    const output = `= Category List =\n\n[Use ${client.config.defaultSettings.prefix}list <categoryname> for details]\n\nNasheeds  :: List all songs \nDua       :: Coming Soon \nTopics    :: Coming Soon`;
    return message.channel.send(output, { code: 'asciidoc', split: { char: '\u200b' } });
  }
  return true;
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'list',
  category: 'Bot',
  description: 'Shows list of options.',
  usage: 'list',
};
