const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("httpcat")
        .setDescription("test")
        .addStringOption((option) => option.setName("code").setDescription("string to echo back").setRequired(true)),
    async execute(interaction) {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch("https://http.cat/" + interaction.options.getString("code"));
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const attachment = new AttachmentBuilder(buffer, { name: interaction.options.getString("code") + ".jpg"});

        await interaction.reply({content: null, files: [attachment]});
    }
}