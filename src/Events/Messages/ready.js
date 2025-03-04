const { Events, ActivityType, PresenceUpdateStatus } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const streamUrl = "https://twitch.tv/no1but0";

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        console.log(
            `\n[CONNÉCTÉ] : ${client.user.username}\n`
            + `[SERVEURS] : ${client.guilds.cache.size}\n`
            + `[MEMBRES] : ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\n`
            + `[CLIENT ID] : ${client.user.id}\n`
            + `[INVITE] : https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0\n`
        );

        const activity = await db.get('activity');
        if (activity) {
            try {
                const activityType = ActivityType[activity.type];
                const options = { type: activityType };

                if (activity.type === 'Streaming') {
                    options.url = streamUrl; 
                }

                await client.user.setActivity(activity.name, options);
                console.log(`[ACTIVITÉ RESTAURÉE] : ${activity.type} ${activity.name}\n`);
            } catch (error) {
                console.error('Erreur lors de la restauration de l\'activité:', error);
            }
        } else {
            await client.user.setActivity("☨", { type: ActivityType.Custom });
            await client.user.setStatus(PresenceUpdateStatus.Idle);
        }

        const storedColor = await db.get('embedColor');
        if (storedColor) {
            client.config.clients.embedColor = storedColor;
            console.log(`[COULEUR RESTAURÉE] : ${storedColor}\n`);
        }
    }
};
