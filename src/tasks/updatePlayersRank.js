const { Task } = require('klasa');

const PUBGPlayer = require('../lib/structures/PUBGPlayer');
const PubgClient = require('../lib/PubgClient');
const Player = require('../lib/structures/models/Player');
const Utils = require('../lib/Utils');
const _ = require('lodash');

module.exports = class extends Task {

	async run() {

		let guild = this.client.guilds.first();
		let playerdb = new PUBGPlayer(guild);
		let allPlayers = playerdb.getAll();

		if(typeof allPlayers !== "undefined" && allPlayers !== null) {

			return;

		}

		_.forEach(allPlayers, function(player) {

			PubgClient.playerStats({playerId: player.pubgID, seasonId: msg.guild.settings.pubgStats.season})
				.then(async playerReturn => {

					let discordUserID = player.id;

					let botPlayerTpp = new Player(discordUserID, playerReturn, 'Tpp');
					botPlayerTpp.pubgID = player.pubgID;
					botPlayerTpp.nick = player.nick;

					let rankID = await Utils.getRankRole(guild, botPlayerTpp.maxRatingTpp, 'Tpp');
					Utils.addRankToPlayer(guild, rankID, discordUserID, 'Tpp', false);

					pubgPlayer.update(botPlayerTpp);

					let botPlayerFpp = new Player(discordUserID, playerReturn, 'Fpp');
					botPlayerFpp.pubgID = player.pubgID;
					botPlayerFpp.nick = player.nick;

					rankID = await Utils.getRankRole(guild, botPlayerFpp.maxRatingTpp, 'Fpp');
					Utils.addRankToPlayer(guild, rankID, discordUserID, 'Fpp', false);

					pubgPlayer.update(botPlayerFpp);

				})
				.catch(err => msg.send(`❌ | Ocorreu um erro ao buscar as informações do seu personagem:\n \`${this.printErrors(err)}\``));

		});
		
	}

	async init() {

        if(!this.client.settings.schedules.some(schedule => schedule.taskName === this.name)) {

			await this.client.schedule.create(this.name, "0 0 * * *");

		}
		
    }

};