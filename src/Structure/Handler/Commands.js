const { readdirSync } = require("fs");

module.exports = (client) => {
    const commandFiles = readdirSync('./src/Commands/').filter(f => f.endsWith('.js'));
    let allCommandsLoaded = true;
    const successMessages = [];
    const errorMessages = [];

    for (const file of commandFiles) {
        try {
            const command = require(`../../../src/Commands/${file}`);
            if (command.help && command.help.name) {
                successMessages.push(`✅・Commande ${file.split('.')[0]} chargée !`);
                client.commands.set(command.help.name, command);
                if (command.help.aliases && Array.isArray(command.help.aliases)) {
                    command.help.aliases.forEach(alias => {
                        client.commands.set(alias, command);
                    });
                }
            } else {
                allCommandsLoaded = false;
                errorMessages.push(`❌・Commande ${file.split('.')[0]} n'a pas de propriété 'help' ou 'name' définie.`);
            }
        } catch (err) {
            allCommandsLoaded = false;
            errorMessages.push(`🚨・Erreur chargement commande ${file.split('.')[0]}: ${err.message}`);
        }
    }

    const commandSubFolders = readdirSync('./src/Commands/').filter(f => !f.endsWith('.js'));
    commandSubFolders.forEach(folder => {
        const commandFiles = readdirSync(`./src/Commands/${folder}/`).filter(f => f.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const command = require(`../../../src/Commands/${folder}/${file}`);
                if (command.help && command.help.name) {
                    successMessages.push(`La commande ${file.split('.')[0]} est chargée avec succès depuis ${folder}`);
                    client.commands.set(command.help.name, command);
                    if (command.help.aliases && Array.isArray(command.help.aliases)) {
                        command.help.aliases.forEach(alias => {
                            client.commands.set(alias, command);
                        });
                    }
                } else {
                    allCommandsLoaded = false;
                    errorMessages.push(`❌・Commande ${file.split('.')[0]}, dossier ${folder} pas de propriété 'help' ou 'name'.`);
                }
            } catch (err) {
                allCommandsLoaded = false;
                errorMessages.push(`🚨・Erreur chargement commande ${file.split('.')[0]} dossier ${folder}: ${err.message}`);
            }
        }
    });

    if (allCommandsLoaded) {
        console.log("✅・Toutes les commandes ont été correctement chargées.");
    } else {
        console.error("🚨・Problèmes lors du chargement des commandes:");
        errorMessages.forEach(msg => console.error(msg));
    }
};
