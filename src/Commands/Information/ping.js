const { EmbedBuilder } = require("discord.js")

exports.help = {
    name: 'ping'
}

exports.run = async (client, message) => {
    const Embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setFooter({ text: client.config.name, iconURL: client.config.logo })

 
        message.channel.send({
            embeds: [
                Embed
                .setTitle('**Ping**')
                .addFields(
                    { name: 'Latence:', value: `**${client.ws.ping}ms.**` }
                )
            ]
        })
 
}