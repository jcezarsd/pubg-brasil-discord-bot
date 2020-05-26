const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 60,
			permissionLevel: 3,
			description: 'Limpa o rank de todos os usuários.'
		});
	}

	async run(msg) {

		msg.channel.send("Limpeza iniciada, esse processo pode algumas horas.");

		let members = await msg.guild.members;

		for (var [key, member] of members) {

			await member.roles.remove([

				msg.guild.settings.pubgStats['desafianteFpp'],
				msg.guild.settings.pubgStats['mestreFpp'],
				msg.guild.settings.pubgStats['diamanteFpp'],
				msg.guild.settings.pubgStats['platinaFpp'],
				msg.guild.settings.pubgStats['ouroFpp'],
				msg.guild.settings.pubgStats['prataFpp'],
				msg.guild.settings.pubgStats['bronzeFpp'],

				msg.guild.settings.pubgStats['desafianteTpp'],
				msg.guild.settings.pubgStats['mestreTpp'],
				msg.guild.settings.pubgStats['diamanteTpp'],
				msg.guild.settings.pubgStats['platinaTpp'],
				msg.guild.settings.pubgStats['ouroTpp'],
				msg.guild.settings.pubgStats['prataTpp'],
				msg.guild.settings.pubgStats['bronzeTpp']

			]).catch(err => { throw err; });
	
		}

		msg.channel.send("Limpeza finalizada com sucesso.");

	}

};
