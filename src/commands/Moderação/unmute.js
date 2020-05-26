const { Command } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['MANAGE_GUILD'],
			description: 'Remove o mute de um usuário',
			usage: '<user:member> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const role = msg.guild.roles.get(msg.guild.settings.mod.muterole);
		if (!role) throw `❌ | eu não consegui encontrar a role "mute", ela foi deletada?`;

		if (member.user.bot) throw `❌ | ${msg.author}, eu não posso executar esta ação contra outro bot.`;
		else if (member.roles.highest.position >= msg.member.roles.highest.position) throw `❌ | ${msg.author}, eu não posso executar esta ação contra este usuário.`;
		else if (!member.roles.has(role.id)) throw `❌ | ${msg.author}, usute usuário não está mutado.`;

		await member.removeRole(role).catch(err => { throw err; });

		if (msg.guild.settings.mod.modlog) {
			new ModLog(msg.guild)
				.setType('unmute')
				.setUser(member.user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`🔈 | **${msg.author.tag}** successfully muted **${member.user.tag}** for *${reason}*.`);
	}

};
