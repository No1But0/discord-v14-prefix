const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'change',
    description: "Change les permissions d'une commande.",
    use: "+change <commande> perm <1/2/3/4/5/6/7>"
};

exports.run = async (client, message, args) => {
    if (args.length < 3 || args[1].toLowerCase() !== 'perm') {
        return message.channel.send(`Utilisation : \`${exports.help.use}\``);
    }

    const command = args[0].toLowerCase();
    const permLevel = parseInt(args[2]);

    if (isNaN(permLevel) || permLevel < 1 || permLevel > 7) {
        return message.channel.send("Le niveau de permission doit être compris entre 1 et 7.");
    }

    const guildID = message.guild.id;
    const userID = message.author.id;
    const buyerID = client.config.buyer;
    let owners = await db.get('owners') || [];
    if (!Array.isArray(owners)) owners = [];

    let hasPerm = userID === buyerID || owners.includes(userID);

    for (let i = 1; i <= 7; i++) {
        const permUsers = await db.get(`Perm${i}_${guildID}`) || [];
        if (permUsers.includes(userID)) {
            hasPerm = true;
            break;
        }
    }

    if (!hasPerm) {
        return message.channel.send(client.config.perm);
    }

    // Stocker les permissions sous `CommandPerms_<commande>_<guildID>`
    const newPerms = [permLevel, 6, 7]; // Ajoute 6 et 7 automatiquement
    await db.set(`CommandPerms_${command}_${guildID}`, newPerms);

    message.channel.send(`La commande \`${command}\` peut maintenant être utilisée par les niveaux \`${newPerms.join(", ")}\`.`);
};
