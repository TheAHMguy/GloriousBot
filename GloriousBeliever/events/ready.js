/* module.exports = async (client) => {
  // Log that the bot is online.
  client.logger.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, 'ready');

  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, { type: 'PLAYING' });
}; */

/* eslint-disable no-param-reassign */
module.exports = async (client) => {
  if (!client.user.bot) {
    client.logger.log('This code must be run on a bot user. Running this bot code on a normal user may not work as expected and is against the Discord Terms of Service.', 'INFO');
    return process.exit(0);
  }

  // Why await here? Because the ready event isn't actually ready, sometimes
  // guild information will come in *after* ready. 1s is plenty, generally,
  // for all of them to be loaded.
  // await wait(1000);

  client.appInfo = await client.fetchApplication();
  setInterval(async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);

  const cMembers = client.users.filter(u => u.id !== '1').size; // Get's number of members cached. (Filters out Clyde)
  const gCount = client.guilds.size;
  // Both `wait` and `client.log` are in `./modules/functions`.
  client.logger.log(`Logged into '${client.user.tag}' (${client.user.id}). Ready to serve ${cMembers} users in ${gCount} guilds. Bot Version: ${client.version}`);

  client.botChecker();

  const game = client.config.playingGame.replace('{{prefix}}', client.config.defaultSettings.prefix).replace('{{guilds}}', gCount).replace('{{version}}', client.version);
  return client.user.setPresence({ status: client.config.status, game: { name: game, type: 0 } });
};
