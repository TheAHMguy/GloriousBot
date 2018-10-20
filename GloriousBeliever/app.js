// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
/* eslint-disable no-restricted-syntax */
if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const Discord = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const sql = require('sqlite');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const fs = require('fs');
const path = require('path');
const color = require('chalk');

const client = new Discord.Client();

sql.open('./database/mainDB.sqlite');

// Require our logger
try {
  client.config = require('./config.js');// eslint-disable-line global-require
  client.logger = require('./util/Logger');// eslint-disable-line global-require
} catch (err) {
  console.error('Unable to load config files \n', err);
  process.exit(1);
}

if (client.config.debug === 'true') {
  console.warn('RUNNING IN DEBUG MODE. SOME PRIVATE INFORMATION (SUCH AS THE TOKEN) MAY BE LOGGED TO CONSOLE');
  client.on('error', e => console.log(e));
  client.on('warn', e => console.log(e));
  client.on('debug', e => console.log(e));
}

const allowedStatuses = ['online', 'idle', 'invisible', 'dnd'];

if (!allowedStatuses.includes(client.config.status)) {
  console.error('Bot status must be one of online/idle/invisible/dnd');
  process.exit(1);
}

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require('./modules/functions.js')(client);
require('./modules/music.js')(client);

// Aliases and commands are put in collections where they can be read from,
// catalogued, listed, etc.
client.commands = new Enmap();
client.aliases = new Enmap();

// Now we integrate the use of Evie's awesome Enhanced Map module, which
// essentially saves a collection to disk. This is great for per-server configs,
// and makes things extremely easy for this purpose.

if (client.config.musicEnabled === 'true') {
  client.musicQueue = new Map();

  client.YouTube = new YouTube(client.config.googleAPIToken);
  client.ytdl = ytdl;
}

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const modules = fs.readdirSync('./commands/').filter(file => fs.statSync(path.join('./commands/', file)).isDirectory());

  for (const module of modules) {
    const commandFiles = fs.readdirSync(`./commands/${module}`);
    process.stdout.write(`${color.cyan('[Bot]:')} Loading ${module} module...\n`);
    for (let file of commandFiles) {
      file = file.substr(0, file.length - 3);
      process.stdout.write(`${color.cyan('[Bot]:')} Loading ${file} command...\n`);
      file = require(`./commands/${module}/${file}`); // eslint-disable-line import/no-dynamic-require, global-require
      client.commands.set(file.help.name.toLowerCase(), file);
      file.conf.module = module;
      for (const alias of file.conf.aliases) {
        client.aliases.set(alias.toLowerCase(), file.help.name);
      }

      if (process.stdout.moveCursor) {
        process.stdout.moveCursor(0, -1);
      }
      if (process.stdout.clearLine) {
        process.stdout.clearLine();
      }
    }

    if (process.stdout.moveCursor) {
      process.stdout.moveCursor(0, -1);
    }
    if (process.stdout.clearLine) {
      process.stdout.clearLine();
    }
  }

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir('./events/');
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach((file) => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`); // eslint-disable-line import/no-dynamic-require, global-require
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  // Generate a cache of client permissions for pretty perms
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i += 1) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
  // Here we login the client.
  client.login(client.config.token);
};

init();
