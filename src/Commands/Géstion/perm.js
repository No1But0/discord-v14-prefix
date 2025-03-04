const { QuickDB } = require('quick.db');
const { EmbedBuilder } = require('discord.js');
const db = new QuickDB();

exports.help = {
    name: 'perm',
    aliases: ['perms'],
    description: 'Affiche les permissions et les utilisateurs/rôles associés.'
};

exports.run = async (client, message, args) => {
    const guildID = message.guild.id;
    const userID = message.author.id;
    const buyerID = client.config.buyer;
    const ownersKey = 'owners';

    // Vérification du mode vent
    const ventStatus = await db.get(`ventStatus_${guildID}`) || false;
    let owners = await db.get(ownersKey) || [];
    if (!Array.isArray(owners)) owners = [];

    // Vérifier si l'utilisateur a une permission suffisante
    let hasPermission = userID === buyerID || owners.includes(userID);

    for (let i = 1; i <= 7; i++) {
        const permUsers = await db.get(`Perm${i}_${guildID}`) || [];
        if (permUsers.includes(userID)) {
            hasPermission = true;
            break;
        }
    }

    if (!hasPermission) {
        if (ventStatus) return; 
        return message.channel.send(client.config.perm);
    }

    let description = "";

    for (let i = 1; i <= 7; i++) {
        const permKey = `Perm${i}_${guildID}`;
        const storedPerms = await db.get(permKey) || [];

        if (storedPerms.length > 0) {
            const mentions = storedPerms.map(id => {
                const role = message.guild.roles.cache.get(id);
                const user = message.guild.members.cache.get(id);
                return role ? `<@&${id}>` : user ? `<@${id}>` : null;
            }).filter(Boolean).join(", ");

            description += `**Permission ${i}**: ${mentions}\n`;
        }
    }

    if (!description) description = "Aucune permission définie.";

    const embed = new EmbedBuilder()
        .setTitle("🔹 Permissions")
        .setDescription(description)
        .setFooter({ text: client.config.name, iconURL: client.config.logo })
        .setColor(client.config.embedColor);

    return message.channel.send({ embeds: [embed] });
};
