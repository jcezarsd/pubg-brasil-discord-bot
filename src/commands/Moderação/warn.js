const { Command } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['MANAGE_GUILD', 'MANAGE_ROLES'],
			description: 'Warns a user for a certain action.',
			usage: '<user:user> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (user.bot) throw `❌ | ${msg.author}, I cannot execute moderation actions against bots.`;
		else if (msg.guild.member(user).roles.highest.position >= msg.member.roles.highest.position) throw `❌ | ${msg.author}, I cannot execute moderation actions against this user.`;

		if (msg.guild.settings.mod.modlog) {
			new ModLog(msg.guild)
				.setType('warn')
				.setUser(user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`⚠ | **${msg.author.tag}** successfully warned **${user.tag}** for *${reason}*.`);
	}

};
