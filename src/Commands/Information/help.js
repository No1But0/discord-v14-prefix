const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'help',
    aliases: ['menu'],
    description: 'Menu du bot',
};

exports.run = async (client, message, args) => {
    const prefix = client.config.prefix;

    const embedAcceuil = new EmbedBuilder()
        .setTitle('<a:Welcome:1337845631485476904>・Accueil')
        .setDescription(`<a:prefix:1337839336447672402>・Mon préfix est \`${client.config.prefix}\`\n<a:setting:1337839352864051341>・Utilise le menu de sélection pour naviguer.`)
        .setFooter({ text: client.config.name, iconURL: client.config.logo })
        .setColor(client.config.embedColor);

    const embeds = {
        information: new EmbedBuilder()
            .setTitle('<a:info:1337843590327566468>・Informations')
            .setDescription(`\`${prefix}help\` - Envoie ce menu d'aide.\n\`${prefix}ping\` - Envoie la latence du bot.`)
            .setFooter({ text: client.config.name, iconURL: client.config.logo })
            .setColor(client.config.embedColor),

        gestion: new EmbedBuilder()
            .setTitle('<a:setting:1337839352864051341>・Géstion')
            .setDescription(`\`${prefix}owner\` - Gère les owners\n\`${prefix}setprefix\` - Manage le préfix du bot.`)
            .setColor(client.config.embedColor)
            .setFooter({ text: client.config.name, iconURL: client.config.logo }),
    };

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help_menu')
        .setPlaceholder('Naviguer via ce menu...')
        .addOptions([
            { label: 'Accueil', value: 'accueil', emoji: '<a:Welcome:1337845631485476904>' },
            { label: 'Informations', value: 'information', emoji: '<a:info:1337843590327566468>' },
            { label: 'Gestion', value: 'gestion', emoji: '<a:setting:1337839352864051341>' }
        ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const msg = await message.channel.send({ embeds: [embedAcceuil], components: [row] });

    const collector = msg.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id) {
            return interaction.reply({ content: 'Vous ne pouvez pas utiliser ce menu.', ephemeral: true });
        }

        const selected = interaction.values[0];
        const newEmbed = selected === 'accueil' ? embedAcceuil : embeds[selected];

        await interaction.update({ embeds: [newEmbed], components: [row] });
    });

    collector.on('end', () => {
        msg.edit({ components: [] }).catch(() => {});
    });
};
