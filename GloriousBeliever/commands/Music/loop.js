exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  sql.get(`SELECT * FROM guildSettings WHERE guildID=${message.guild.id}`).then((row) => {
    if (!row) {
      sql.run('INSERT INTO guildSettings (guildID, musicLoop, prefix) VALUES (?,?,?)', [message.guild.id, 1, '-']);
      return message.channel.send('🔂 Enabled!');
    }
    if (row.musicLoop === 0) {
      sql.run(`UPDATE guildSettings SET musicLoop = ${1}`);
      message.channel.send('🔂 Enabled!');
    } else {
      sql.run(`UPDATE guildSettings SET musicLoop = ${0}`);
      message.channel.send('🔂 Disabled!');
    }
    return false;
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Users',
};

exports.help = {
  name: 'loop',
  category: 'Music',
  description: 'Loops the current song.',
  usage: 'loop',
};
