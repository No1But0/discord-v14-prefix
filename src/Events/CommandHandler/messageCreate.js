const { Events, ChannelType } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message, client) {
        const prefix = client.config.prefix;

        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) return;

        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);

        if (!cmd.startsWith(prefix)) return;

        let commandName = cmd.slice(prefix.length);
        let commandFile = client.commands.get(commandName);

        if (!commandFile) {
            return;
        }

        try {
            commandFile.run(client, message, args);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
            message.channel.send("Une erreur s'est produite lors de l'exécution de la commande.");
        }
    }
};
