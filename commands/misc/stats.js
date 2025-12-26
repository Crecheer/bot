const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("shows bot stats!"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xfe8019)
            .setTitle("Bot Stats")
            .addFields(
                { name: "Server Count", value: interaction.client.guilds.cache.size.toString() },
                { name: "Uptime", value: "placeholder value because i need to go but want to commit first so i can work on it when im back home! :D"}
            )
    
        interaction.reply({ embeds: [embed]})
    }
}