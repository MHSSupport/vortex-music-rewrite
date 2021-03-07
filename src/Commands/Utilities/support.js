const { MessageEmbed } = require("discord.js"),
	Command = require("../../Structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "support",
			category: "Utilites"
		});
	}
	async run(message, args) {
		const e = new MessageEmbed()
			.setThumbnail(this.client.user.avatarURL())
			.setColor("RANDOM")
			.setTimestamp()
			.addField(`${this.client.user.username}\'s support server:`, [`[here](https://discord.gg/KFVkKYDb2P)`]);
		message.channel.send(e);
	}
};
