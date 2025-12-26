const { SlashCommandBuilder, AttachmentBuilder, SectionBuilder, MessageFlags     } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows help menu"),
    async execute(interaction) {
        const image = new AttachmentBuilder("./assets/images/pfp.jpg");

        const section = new SectionBuilder()
            .addTextDisplayComponents((textDisplay) => 
            textDisplay.setContent(
                "Commands: \nping - replies with pong\ncat - replies with a picture of a cat :3\nhelp - shows this menu\necho - echoes something back\nprofile - shows user profile"
            ))
            .setThumbnailAccessory(
                (thumbnail) => thumbnail.setURL("attachment://pfp.jpg")
            );
        
        await interaction.reply({components: [section], files: [image], flags: MessageFlags.IsComponentsV2})
    }
}