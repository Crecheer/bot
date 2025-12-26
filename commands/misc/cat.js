const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js")
const { catApiKey } = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat").setDescription("Sends a picture of a car in the channel"),
    async execute(interaction) {
        const fetch = (await import('node-fetch')).default;

        const headers = {
            "x-api-key": catApiKey
        }

        const response = await fetch("https://api.thecatapi.com/v1/images/search", { headers });
        const data = await response.json();
        const imageResponse = await fetch(data[0]["url"]);
        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const attachment = new AttachmentBuilder(buffer, { name: data[0]["id"] + ".jpg"});

        await interaction.reply({content: null, files: [attachment]})
    }
}
