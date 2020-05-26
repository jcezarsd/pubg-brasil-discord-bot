const { Command } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');
const BanUser = require('../../lib/structures/BanUser');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['BAN_MEMBERS'],
			description: 'Remove o ban de um membro do servidor.',
			usage: '<user:user> [reason:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const bans = await msg.guild.fetchBans();
		if (!bans.has(user.id)) throw `❌ | ${msg.author}, este usuário não está banido.`;

		var banUser = new BanUser(msg.guild);

		await banUser.delete(user.id);
		await msg.guild.members.unban(user, reason);

		if (msg.guild.settings.mod.modlog) {
			new ModLog(msg.guild)
				.setType('unban')
				.setUser(user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
		}

		return msg.send(`✅ | **${msg.author.tag}** retirou o ban do usuário **${user.tag}** porque *${reason}*.`);
	}

};
