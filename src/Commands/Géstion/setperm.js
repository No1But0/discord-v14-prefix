const { QuickDB } = require('quick.db');
const db = new QuickDB();

exports.help = {
    name: 'set',
    perms: 'Usage: +set perm <1-7> @utilisateur/@rôle',
    description: 'Définit des permissions pour des utilisateurs ou des rôles.'
};

exports.run = async (client, message, args) => {
    const guildID = message.guild.id;

    if (args.length === 0) return; // Si seulement "+set", ne rien faire

    if (args[0].toLowerCase() === "perm") {
        if (args.length === 1) {
            return message.channel.send(exports.help.perms);
        }

        const permLevel = args[1];
        if (!["1", "2", "3", "4", "5", "6", "7"].includes(permLevel)) {
            return message.channel.send("❌ Le niveau de permission doit être entre 1 et 7.");
        }

        const mentions = message.mentions.users.map(user => user.id).concat(
            message.mentions.roles.map(role => role.id)
        );

        if (mentions.length === 0) {
            return message.channel.send("❌ Vous devez mentionner au moins un utilisateur ou un rôle.");
        }

        const permKey = `Perm${permLevel}_${guildID}`;
        let existingPerms = await db.get(permKey) || [];

        // Ajoute les nouvelles mentions sans doublons
        existingPerms = [...new Set([...existingPerms, ...mentions])];

        await db.set(permKey, existingPerms);
        return message.channel.send(`✅ Permissions ${permLevel} mises à jour.`);
    }
};
