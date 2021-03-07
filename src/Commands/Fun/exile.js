const Command = require("../../Structures/Command"),
	{ MessageEmbed } = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: "exile",
			description: "This allows you to exile a user to the fucking moon",
			category: "Fun"
		});
	}

	async run(message, args) {
		const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();

		if (member?.id === "381710555096023061") {
			return message.channel.send(`sorry, but \`@${this.client.users.cache.get("381710555096023061").tag}\` is special and cannot be exiled`);
		}

		if (member?.id === "815282644438220800") {
			return message.channel.send(`you cannot exile my developer`);
		}

		if (member?.id === message.author.id) {
			return message.channel.send(`sorry, <@${message.author.id}> you too are special special and cannot be exiled`);
		}
		if (member?.id === "810301420585746445") {
			return message.channel.send(`You cannot exile the developers femboy bf :(`);
		}
		if (member?.id === "743948399270822029") {
			return message.channel.send(`No one can exile da hedgehog :>`);
		}
		if (member?.id == "536538183555481601") {
			return message.channel.send(`no one can exile the Yaki Dev :>`);
		}

		if (!member) {
			return message.channel.send("Please include a valid member");
		}

		const e = new MessageEmbed()
			.setTitle(member.user.username)
			.setColor("RANDOM")
			.setThumbnail(member.user.avatarURL({ dynamic: true }))
			.addField(`Hello ${member.user.tag}`, [`You have been exiled to the fucking moon!!`]);
		message.channel.send(e);
	}
};
