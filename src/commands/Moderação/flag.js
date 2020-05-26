const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const ModLog = require('../../lib/structures/ModLog');
const FlagUser = require('../../lib/structures/FlagUser');

const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['MANAGE_GUILD', 'MANAGE_ROLES'],
			description: 'Adicionar flag a um usuário por uma quantidade de dias.',
			usage: '<user:user> <time:str> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, time, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const member = await msg.guild.members.fetch(user).catch(() => null);

		const role = msg.guild.roles.get(msg.guild.settings.mod.flagRole);
		if (!role) throw `❌ | eu não consegui encontrar a role "flag", ela foi deletada?`;

		if (!time) throw `❌ | ${msg.author}, você deve especificar uma duração da flag.`;

		if (member.user.bot) throw `❌ | ${msg.author}, eu não posso executar esta ação contra outro bot.`;
		else if (member.roles.highest.position >= msg.member.roles.highest.position) throw `❌ | ${msg.author}, eu não posso executar esta ação contra este usuário.`;
		else if (member.roles.has(role.id)) throw `❌ | ${msg.author}, este usuário já está com flag.`;

		var flagUser = new FlagUser(msg.guild);

		await flagUser.create(user, time, reason);

		await member.roles.add(role, reason).catch(err => { throw err; });
		await msg.send(`🏳 | **${msg.author.tag}** adicionou flag ao usuário **${member.user.tag}** por *${time} dias* ${reason ? `devido à *${reason}*.`: 'sem motivo.'}`);
		await member.send(`🏳 | **${msg.author.tag}** te adicionou uma flag por *${time} dias* ${reason ? `devido à *${reason}*.`: 'sem motivo.'}`);

		if (msg.guild.settings.mod.modlog) {
			new ModLog(msg.guild)
				.setType('flag')
				.setUser(member.user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

	}

};
