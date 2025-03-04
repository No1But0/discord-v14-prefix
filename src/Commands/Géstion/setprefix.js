const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'setprefix',
    aliases: ['prefix'],
    description: 'Change le préfixe du bot.'
};

exports.run = async (client, message, args) => {
    const userID = message.author.id;
    const buyerID = client.config.buyer;
    const ownersKey = 'owners';
    const guildID = message.guild.id;

    let owners = await db.get(ownersKey) || [];
    if (!Array.isArray(owners)) {
        owners = [];
    }

    const ventStatus = await db.get(`ventStatus_${guildID}`) || false;
    const isOwner = userID === buyerID || owners.includes(userID);

    if (!isOwner) {
        if (ventStatus) {
            return;
        } else {
            return message.channel.send(client.config.perm)
        }
    }

    if (args.length === 0) {
        return message.channel.send('Veuillez saisir le nouveau préfixe.');
    }

    const newPrefix = args[0];

    client.config.prefix = newPrefix;
    await db.set('prefix', newPrefix);

    if (newPrefix === client.config.prefix) {
        return message.channel.send(`Préfix déjà defini sur \`{newPrefix}\`.`);
    }

    return message.channel.send(`Mon nouveau préfixe est : \`${newPrefix}\``);
}