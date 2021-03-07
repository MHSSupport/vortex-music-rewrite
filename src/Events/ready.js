const Event = require("../Structures/Event"),
	{ MessageEmbed } = require("discord.js");
vortexMusicEmbed = require("../Structures/vortexMusicEmbed");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run(message, args) {
		const guildInvites = new Map();

		this.client.on("inviteCreate", async invite => {
			guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
		});

		this.client.guilds.cache.forEach(guild => {
			guild
				.fetchInvites()
				.then(invites => guildInvites.set(guild.id, invites))
				.catch(error => this.client.logger.error(`InviteCreate Error: \t${error.message}`));
		});
		const inviteLog = "817890715929542657";

		this.client.on("guildMemberAdd", async member => {
			const cachedInvites = guildInvites.get(member.guild.id);
			const newInvites = await member.guild.fetchInvites();
			guildInvites.set(member.guild.id, newInvites);

			try {
				const usedInvites = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
				const embed = new vortexMusicEmbed()
					.setTitle(`${member.user.tag} (${member.user.id})`)
					.setColor("RANDOM")
					.setThumbnail(member.user.avatarURL({ dynamic: true }))
					.addField(`New user join!`, [`Tag: ${member.user.tag}`, `ID: ${member.user.id}`, `[Invite used](${usedInvites.url})`])
					.addField(`Guild`, [
						`Name: ${member.guild.name}`,
						`ID: ${member.guild.id}`,
						`Inviter: ${usedInvites.inviter.tag}`,
						`Invite Uses: ${usedInvites.uses}`
					]);
				this.client.channels.cache.get(inviteLog).send(embed);
				this.client.logger.log(`\n---------\n${member.user.tag}, ${member.user.id}, joined ${member.guild.name} using the invite:${usedInvites.url}`);
			} catch (error) {
				this.client.logger.error(error);
			}
		});

		this.client.on("guildMemberRemove", async member => {
			this.client.logger.log(`\n---------\n${member.user.tag}, ${member.user.id}, left ${member.guild.name}`);
		});

		const guildJoinChannel = "816815152006430772";
		const guildLeaveChannel = "816815152006430772";

		this.client.on("guildCreate", guild => {
			this.client.logger.log(`\n---------\nI have been added to '${guild.name}' (${guild.id}) with ${guild.memberCount} members!`);

			const f = new MessageEmbed()
				.setColor("RANDOM")
				.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
				.addField(`New guild joined:`, [`Name: ${guild.name}`, `ID: ${guild.id}`, `Owner: ${guild.owner.user.tag}`, `Owner ID:${guild.ownerID}`]);
			this.client.channels.cache.get(guildJoinChannel).send(f);
		});

		this.client.on("guildDelete", guild => {
			this.client.logger.log(`\n---------\nI have been removed from '${guild.name}' (${guild.id}) with ${guild.memberCount} members!`);
			const a = new MessageEmbed()
				.setColor("RANDOM")
				.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
				.addField(`New guild Leave:`, [
					`Name: ${guild.name}`,
					`ID: ${guild.id}`,
					`Owner: ${guild.members.fetch(message.guild.ownerID).user.tag}`,
					`Owner ID:${guild.ownerID}`
				]);
			this.client.channels.cache.get(guildLeaveChannel).send(a);
		});

		this.log();

		const activities = [
			`${this.client.guilds.cache.size} servers!`,
			`${this.client.channels.cache.size} channels!`,
			`${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`
		];
		this.activity(activities);
	}

	activity(activities) {
		let i = 0;
		setInterval(() => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" }), 15000);
	}

	log() {
		this.client.logger.log(
			[
				`Logged in as ${this.client.user.tag}`,
				`Loaded ${this.client.commands.size} commands!`,
				`Loaded ${this.client.events.size} events!`,
				`Client ID: ${this.client.user.id}`,
				`invite: https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8`
			].join("\n")
		);
		this.console();
	}

	console() {
		this.client.logger.log(
			`\nServers[${this.client.guilds.cache.size}]: \n---------\n${this.client.guilds.cache.map(guild => guild.id + "\t" + guild.name).join("\n")}`
		);
	}
};
