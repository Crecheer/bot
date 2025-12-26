const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

// run this once when client is ready
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready, logged in as ${readyClient.user.tag}`);
})

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const f of commandFolders) {
    const commandsPath = path.join(foldersPath, f);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    for (const f of commandFiles) {
        const filePath = path.join(commandsPath, f);
        const command = require(filePath)

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                flag: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                flag: MessageFlags.Ephemeral 
            })
        }
    }
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const f of eventFiles) {
    const filePath = path.join(eventsPath, f);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);
