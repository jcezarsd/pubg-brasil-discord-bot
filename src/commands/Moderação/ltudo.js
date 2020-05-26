const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['MANAGE_MESSAGES'],
			description: 'Limpa todas as mensagens de um canal, com exceção das fixadas.',
			usage: '',
			usageDelim: ' '
		});
	}

	async run(msg) {

		let messages = await this.getNextMessages(msg);

		while(messages && messages.size != 0) {

			await msg.channel.bulkDelete(messages)
				.then(msgs => console.log(`Bulk deleted ${msgs.size} messages`))
				.catch(error => msg.reply(`Não foi possível excluir mensagens pelo seguinte movito: ${error}`));

			messages = await this.getNextMessages(msg);

		}

	}

	async getNextMessages(msg) {

		let messages;

		messages = await msg.channel.messages.fetch();

		messages.forEach(function(msg, id) {
			if(msg.pinned)
				messages.delete(id);
		});

		return messages;
	}

};
