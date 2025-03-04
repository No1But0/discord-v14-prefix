const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'ban',
    description: "Permet de ban un utilisateur rapidement.",
    use: "+ban <id/user>"
}

exports.run = async (client, message, args) => {
    const userID = message.author.id;
    const buyerID = client.config.buyer;
    const guildID = message.guild.id;
    const ownerKey = 'owners';

    const ventStatus = await db.get(`ventStatus_${guildID}`);
    let owners = await db.get(ownerKey) || [];
    if (!Array.isArray(owners)) owners = [];

    const hasPerm = userID === buyerID || owners.includes(userID);

    for (let i = 1; i <= 7; i++) {
        const permUsers = await db.get(`Perm${i}_${guildID}`) || [];
        if (permUsers.includes(userID)) {
            hasPerm = true;
            break;
        }
    }

    if (!hasPerm) {
        if (ventStatus) return;
        return message.channel.send(client.config.perm);
    }

    if (args.length === 0) {
        message.channel.send(`Utilisation : \`${use}\``);
    }

    const banUser =  message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

    if (!banUser) {
        message.channel.send("Utilisateur introuvable.");
    }

    const member = await message.guild.members.fetch(banUser.id).catch(() => null);

    if (!member) {
        message.channel.send("L'utilisateur n'est pas sur le serveur.");
    }

    if (!member.bannable) {
        message.channel.send("Bannissement de l'utilisateur impossible.");
    }

    const reason = args.slice(1).join(" ") || "Raison non saisie";

    await member.ban({ reason }).catch(err => {
        return message.channel.send(client.config.error);
    });

    const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setFooter({ text: client.config.name, iconURL: client.config.logo })
        .setTitle("Bannisement")
        .setTimestamp()
        .setDescription(`**Banni :** \`${banUser.tag}\` \`(${banUser.id})\`\n**Banni par :** \`${message.author.tag}\` \`(${message.author.id})\``);
    
    message.channel.send({ embeds: [embed] });
}