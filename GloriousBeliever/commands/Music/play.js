/* eslint-disable no-restricted-syntax, no-return-assign */

exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  if (client.config.musicEnabled !== 'true') return message.channel.send('Music commands are disabled');
  const { voiceChannel } = message.member;
  if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT')) {
    return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
  }
  if (!permissions.has('SPEAK')) {
    return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
  }
  const searchString = args.join(' ');

  return sql.get(`SELECT * FROM musicMaster WHERE songName = '${searchString}' AND guildID = '${message.guild.id}'`).then(async (row) => {
    if (!row) {
      message.channel.send('There is no song with this name.');
    } else {
      let video;
      try {
        video = await client.YouTube.getVideo(row.ytSong);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
      return client.handleVideo(video, message, voiceChannel);
    }
    return true;
  });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
};

exports.help = {
  name: 'play',
  category: 'Music',
  description: 'Plays a song from playlist.',
  usage: 'play [song name]',
};
