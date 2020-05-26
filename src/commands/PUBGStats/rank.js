const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 0,
			description: 'Este comando não existe mais'
		});
	}

	async run(msg) {

		msg.channel.send("Este comando não existe mais, **Leia as instruções fixadas!!**");

	}

};
