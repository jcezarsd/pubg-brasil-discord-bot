const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

const PubgClient = require('../../lib/PubgClient');
const PUBGPlayer = require('../../lib/structures/PUBGPlayer');
const Player = require('../../lib/structures/models/Player');
const Utils = require('../../lib/Utils')

const moment = require('moment');

const MATCH = {
	SOLOFPP: 'soloFPP',
	DUOFPP: 'duoFPP',
	SQUADFPP: 'squadFPP',
};

const PERSPECTIVE = 'Fpp'

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 60,
			permissionLevel: 0,
			description: 'Exibe as informações de um player específico e atualiza seu rank no modo FPP.'
		});
	}

	async run(msg) {

		let discordUserID = msg.author.id;
		let pubgPlayer = new PUBGPlayer(msg.guild);

		let playerBanco = await pubgPlayer.get(discordUserID);

		if (!playerBanco) throw `❌ | ${msg.author}, você ainda não foi registrado neste servidor, por favor utilize o comando \`!registrar seu_nick\` para se registrar.`;

		if(playerBanco.fppUpdatedAt && (moment().diff(moment(playerBanco.fppUpdatedAt), 'm') <= 30)) {

			let embed = this.createEmbedStats(msg.author, playerBanco);
			msg.guild.channels.get(msg.guild.settings.pubgStats.rankChat).send(embed);

		} else {

			PubgClient.playerStats({playerId: playerBanco.pubgID, seasonId: msg.guild.settings.pubgStats.season})
				.then(async player => {

					let botPlayer = new Player(discordUserID, player, PERSPECTIVE);
					botPlayer.pubgID = playerBanco.pubgID;
					botPlayer.nick = playerBanco.nick;					

					let rankID = await Utils.getRankRole(msg.guild, botPlayer.maxRatingFpp, PERSPECTIVE);
					Utils.addRankToPlayer(msg.guild, rankID, discordUserID, PERSPECTIVE, true, msg);

					pubgPlayer.update(botPlayer);

					let embed = this.createEmbedStats(msg.author, botPlayer);
					msg.guild.channels.get(msg.guild.settings.pubgStats.rankChat).send(embed);

				})
				.catch(err => msg.send(`❌ | Ocorreu um erro ao buscar as informações do seu personagem:\n \`${Utils.printErrors(err)}\``));

		}

	}

	createEmbedStats(user, player) {

		let embed = new MessageEmbed()
			.setTitle('**Status do Personagem:**')
			.setDescription("Discord: " + user.username + " \n PUBG: " + player.nick + "\n ")
			.setColor('NAVY')
			.setThumbnail(user.avatarURL())
			.setTimestamp(player.fppUpdatedAt)
			.setFooter('Informações recuperadas utilizando a API oficial do PUBG.');
	
		this.createFieldsStats(embed, player);

		return embed;
	
	}

	createFieldsStats(embedMessage, player) {

		for(let type in MATCH) {

			embedMessage.fields.push({

				name: "**" + MATCH[type].toUpperCase() + "**",
				value: "Wins: " + player[MATCH[type]].wins + "\n" +
						"Kills: " + player[MATCH[type]].kills + "\n" + 
						"K/D: " + player[MATCH[type]].kd + "\n" + 
						"Dano médio: " + player[MATCH[type]].damageDealt + "\n" +
						"Rating: " + player[MATCH[type]].rankPoints + "\n",
				inline: true

			});

		}

	}

};
