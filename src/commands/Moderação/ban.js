const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../lib/structures/ModLog');
const BanUser = require('../../lib/structures/BanUser');

const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['BAN_MEMBERS'],
			description: 'Banir um membro do servidor.',
			usage: '<user:user> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, banTime, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (user.id === msg.author.id) throw `❌ | ${msg.author}, porque você baniria você mesmo?`;
		if (user.bot) throw `❌ | ${msg.author}, eu não posso executar esta ação contra outro bot.`;

		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (!member) throw `❌ | ${msg.author}, usuário não existe nesse servidor.`;
		else if (!member.bannable) throw `❌ | ${msg.author}, eu não posso banir esse usuário.`;
		else if (member.roles.highest.position >= msg.member.roles.highest.position) throw `❌ | ${msg.author}, eu não posso executar esta ação contra este usuário.`;

		var banUser = new BanUser(msg.guild);

		await banUser.create(user, banTime, reason);
		await msg.guild.members.ban(user, { reason });
		let banDate = moment();

		let embed = new MessageEmbed()
			.setTitle(':no_entry: Banido ' + (banTime === 0 ? 'eternamente' : 'por ' + banTime + ' dia(s)') + ' :no_entry:')
			.setColor(0xc10909)
			.setThumbnail(member.avatarURL)

			.setFooter(banDate.format('DD/MM/YYYY HH:mm') + ' - ' + 'Banido ' + (banTime === 0 ? 'eternamente' : 'até ' + banDate.add(banTime, 'd').format('DD/MM/YYYY HH:mm')))

			.addField('Usuário:', member.displayName, true)
			.addField('Banido por:', msg.author.username, true)
			.addField('Motivo', reason, true);

		msg.guild.channels.get(msg.guild.settings.mod.chatBan).send(embed);

		if (msg.guild.settings.mod.modlog) {
			new ModLog(msg.guild)
				.setType('ban')
				.setUser(user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`🚨 | **${msg.author.tag}** baniu com sucesso o usuário **${user.tag}** pelo seguinte motivo: *${reason}*.`);
	}

};
