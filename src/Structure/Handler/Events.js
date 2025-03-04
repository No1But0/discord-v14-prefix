const { readdirSync } = require("fs");

module.exports = (client) => {
    const eventFiles = readdirSync('./src/Events/').filter(f => f.endsWith('.js'));
    let allEventsLoaded = true;
    const successMessages = [];
    const errorMessages = [];

    for (const file of eventFiles) {
        try {
            const event = require(`../../../src/Events/${file}`);
            successMessages.push(`✅・Event ${file.split('.')[0]} chargé !`);
            client.on(event.name, (...args) => event.execute(...args, client));
        } catch (err) {
            allEventsLoaded = false;
            errorMessages.push(`❌・Erreur chargement event ${file.split('.')[0]}: ${err.message}`);
        }
    }

    const eventSubFolders = readdirSync('./src/Events/').filter(f => !f.endsWith('.js'));
    eventSubFolders.forEach(folder => {
        const eventFiles = readdirSync(`./src/Events/${folder}/`).filter(f => f.endsWith('.js'));
        for (const file of eventFiles) {
            try {
                const event = require(`../../../src/Events/${folder}/${file}`);
                successMessages.push(`✅・Event ${file.split('.')[0]} chargé depuis ${folder}`);
                client.on(event.name, (...args) => event.execute(...args, client));
            } catch (err) {
                allEventsLoaded = false;
                errorMessages.push(`❌・Erreur chargement event ${file.split('.')[0]} dossier ${folder}: ${err.message}`);
            }
        }
    });

    if (allEventsLoaded) {
        console.log("✅・Tous les events ont été correctement chargés.");
    } else {
        console.error("🚨・Problèmes lors du chargement des events:");
        errorMessages.forEach(msg => console.error(msg));
    }
};