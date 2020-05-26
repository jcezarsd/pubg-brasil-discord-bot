const { Command } = require('klasa');
const PubgClient = require('../../lib/PubgClient');

const PUBGPlayer = require('../../lib/structures/PUBGPlayer');
const Player = require('../../lib/structures/models/Player');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 0,
			description: 'Registra um player no rank do servidor.',
			usage: '<playerName:str>',
			extendedHelp: 'Digite o comando !registrar e o nome do seu player no PUBG. Por exemplo: `!registrar stormJC`'
		});
	}

	async run(msg, [playerName]) {

		let discordUserID = msg.author.id;
		let pubgPlayer = new PUBGPlayer(msg.guild);

		let player = await pubgPlayer.get(discordUserID);

		if (player) throw `❌ | ${msg.author}, você já tem um personagem registrado no rank com o nome: **${player.nick}**.`;

		player = PubgClient.player({name: playerName})
			.then(player => {
				pubgPlayer.create(new Player(discordUserID, player));
				msg.send(`✅ | O player *${playerName}* foi registrado com sucesso.`)
			})
			.catch(err => msg.send(`❌ | O player *${playerName}* não existe nos registros do PUBG.`));

	}

};
