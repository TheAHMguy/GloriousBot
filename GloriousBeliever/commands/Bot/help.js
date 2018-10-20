exports.run = async (client, message, args, level, sql) => { // eslint-disable-line no-unused-vars
  // If no specific command is called, show all filtered commands.
  if (!args[0]) {
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true); // eslint-disable-line max-len

    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = '';
    let output = `= Command List =\n\n[Use ${client.config.defaultSettings.prefix}help <commandname> for details]\n`;
    const sorted = myCommands.array().sort((p, c) => (p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1)); // eslint-disable-line no-nested-ternary
    sorted.forEach((c) => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${client.config.defaultSettings.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    if (client.config.defaultSettings.sendHelp === 'channel') {
      return message.channel.send(output, { code: 'asciidoc', split: { char: '\u200b' } });
    }
    try {
      await message.author.send(output, { code: 'asciidoc', split: { char: '\u200b' } });
    } catch (e) {
      return message.reply("Can't send help message if direct messages is disabled");
    }
  } else {
    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return; // eslint-disable-line consistent-return
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(', ')}\n= ${command.help.name} =`, { code: 'asciidoc' });
    }
  }
  return false;
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 'User',
};

exports.help = {
  name: 'help',
  category: 'Bot',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]',
};
