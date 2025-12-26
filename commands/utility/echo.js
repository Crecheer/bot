const { SlashCommandBuilder, interaction } = require("discord.js")



module.exports = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Echoes something back!")
        .addStringOption((option) => option.setName("input").setDescription("string to echo back")),
    async execute(interaction) {
        const reply = interaction.options.getString("input");
        await interaction.reply(reply);
    }
}