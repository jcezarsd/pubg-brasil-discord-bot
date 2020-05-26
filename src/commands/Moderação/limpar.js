const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['MANAGE_MESSAGES'],
			description: 'Exclui X quantidade de mensagens de um canal, ou do usuário Y.',
			usage: '[user:user] <amount:int{2,100}>',
			usageDelim: ' '
		});
	}

	async run(msg, [user, amount]) {
		if (!amount && !user) throw `❌ | ${msg.author}, você deve especificar um usuário e uma quantidade, ou apenas uma quantidade, de mensagens a serem excluidas.`;

		let messages = await msg.channel.messages.fetch({ limit: amount });

		if (user) {
			const filterBy = user ? user.id : this.client.user.id;
			messages = messages.filter(mes => mes.author.id === filterBy).array().slice(0, amount);
		}

		messages.forEach(function(message, id) {
			if(message.pinned)
				messages.delete(id);
		});

		await msg.channel.bulkDelete(messages, true).catch(err => { throw err; });

		// return msg.send(`🗑 | Deleted ${user ? `**${amount} messages** from user **${user.tag}**` : `**${amount} messages**`}.`);
	}

};
