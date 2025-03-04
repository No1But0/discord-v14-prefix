const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'vent',
    use: 'vent <on/off/status>',
    description: 'Le bot met un vent aux utilisateur ne disposant pas les permissions pour utiliser une commande',
    aliases: ['reply']
};

exports.run = async (client, message, args) => {
    const userID = message.author.id;
    const buyerID = client.config.buyer;
    const ownersKey = 'owners';
    const guildID = message.guild.id;

    let owners = await db.get(ownersKey) || [];

    if(!Array.isArray(owners)) {
        owners = [];
    }

    const ventStatus = await db.get(`ventStatus_${guildID}`) || false;
    const isOwner = userID === buyerID || owners.includes(userID);

    if (!isOwner) {
        if (ventStatus) return; // Si ventStatus est actif, on stoppe l'exécution immédiatement
        return message.channel.send(client.config.perm); // Sinon, on envoie un message d'erreur et on stoppe
    }

    if (args.length === 0) {
        message.channel.send(`Usage : \`${exports.help.use}\`.`);
    }

    const ventSet = args[0];

    if (ventSet === "on") {
        await db.set(`ventStatus_${guildID}`, true);
        return message.channel.send(`<a:on:1345828133143707770> Mode **vent** activé`);
    } else if (ventSet === "off") {
        await db.set(`ventStatus_${guildID}`, false);
        return message.channel.send(`<a:off:1345828118195208233> Mode **vent** désactivé`);
    }

    if (ventSet === "status") {
        const status = await db.get(`ventStatus_${guildID}`);

        if (status === true) {
            return message.channel.send(`<a:on:1345828133143707770> Mode **vent** est activé`);
        } else {
            return message.channel.send(`<a:off:1345828118195208233> Mode **vent** est désactivé`)
        }
    }
}