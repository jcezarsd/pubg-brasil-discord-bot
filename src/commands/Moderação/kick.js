const { Command } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['KICK_MEMBERS'],
			description: 'Kicka membros do servidor.',
			usage: '<user:member> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (member.user.bot) throw `❌ | ${msg.author}, eu não posso executar esta ação contra outro bot.`;
		else if (!member.kickable) throw `❌ | ${msg.author}, não posso kickar esse usuário.`;
		else if (member.roles.highest.position >= msg.member.roles.highest.position) throw `❌ | ${msg.author}, eu não posso executar esta ação contra este usuário.`;

		await member.kick(reason);

		if (msg.guild.settings.mod.modlog) {
			new ModLog(msg.guild)
				.setType('kick')
				.setUser(member.user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`🛑 | **${msg.author.tag}**, você kickou o usuário **${member.user.tag}** porque *${reason}*.`);
	}

};
