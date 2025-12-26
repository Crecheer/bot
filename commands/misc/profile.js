const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { request } = require("undici");

const applyText = (canvas, text) => {
	const context = canvas.getContext("2d");

    // base fontsize
	let fontSize = 70;

	do {
		context.font = `${(fontSize -= 10)}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("shows the profile of a user"),
        // .addUserOption((option) => option.setName("user").setDescription("which user to get the profile of").setRequired(true)),
    async execute(interaction) {
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext("2d");
        
        // text!
	    context.font = applyText(canvas, interaction.member.displayName); 
        context.fillStyle = "#ffffff";
        context.fillText(interaction.member.displayName, canvas.width / 2.5, canvas.height / 1.8);


        // fetch user pfp
	    const { body } = await request(interaction.user.displayAvatarURL({ extension: 'png' }));
	    const avatar = await Canvas.loadImage(await body.arrayBuffer());

        // make it circle!
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        // draw avatar to image
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(await canvas.encode("png"), {name: "image.png"});
        interaction.reply({ files: [attachment]})
    }
}