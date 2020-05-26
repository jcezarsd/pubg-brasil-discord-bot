const { Command } = require('klasa');

const PUBGPlayer = require('../../lib/structures/PUBGPlayer');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			description: 'Remove o registro de um player no rank.',
			usage: '<user:user>',
			extendedHelp: 'Digite o comando !removeRegistro e o usuario que deseja remover. Por exemplo: `!regiremoveRegistrostrar @StormJC`'
		});
	}

	async run(msg, [user]) {

		let discordUserID = user.id;
		let pubgPlayer = new PUBGPlayer(msg.guild);

		let player = await pubgPlayer.get(discordUserID);

		if (!player) throw `❌ | ${msg.author}, este usuário não tem registro no rank.`;

		await pubgPlayer.delete(discordUserID);

		msg.send(`✅ | O registro do *${user.username}* foi removido com sucesso.`)

	}

};
