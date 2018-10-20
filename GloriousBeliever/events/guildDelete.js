// This event executes when a new guild (server) is left.
const sql = require('sqlite');

module.exports = (client, guild) => {
  client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);

  let dbNames = ['bListRoles', 'levelRoles', 'musicMaster', 'userScores', 'userReports', 'userWarnings', 'pictureMaster'];
  for (let step = 0; step < 3; step += 1) {
    const tableName = dbNames[0];
    sql.get(`SELECT * FROM ${tableName} WHERE guildID = ${guild.id}`).then((lGuild) => {
      if (!lGuild) {
        console.log(`${guild.name} (${guild.id}) had no rows in ${tableName} db.`);
      } else {
        sql.run(`DELETE FROM ${tableName} WHERE guildID=${guild.id}`);
        console.log(`${guild.name} (${guild.id}) has been deleted from ${tableName} db.`);
      }
    }).catch((e) => {
      console.log(e);
    });
    dbNames = dbNames.slice(1);
  }
  const gCount = client.guilds.size;
  const game = client.config.playingGame.replace('{{prefix}}', client.config.defaultSettings.prefix).replace('{{guilds}}', gCount);
  client.user.setPresence({ status: client.config.status, game: { name: game, type: 0 } });
};
