const { Timestamp } = require('klasa');
const ts = new Timestamp('h:mm:ss');

module.exports = class Utils {

	/**
     * Split a string by its latest space character in a range from the character 0 to the selected one.
     * @param {string} str    The text to split.
     * @param {number} length The length of the desired string.
     * @returns {string}
     * @static
     */
	static splitText(str, length) {
		const x = str.substring(0, length).lastIndexOf(' '); //eslint-disable-line
		const pos = x === -1 ? length : x;
		return str.substring(0, pos);
	}

	/**
     * Show time duration in an un-trimmed h:mm:ss format.
     * @param {number} duration Duration in milliseconds.
     * @returns {string}
     */
	static showSeconds(duration) {
		return ts.display(duration);
	}

	static addDaysToDate(date, days) {
		var dat = date;
		dat.setDate(dat.getDate() + days);
		return dat;
	}


	static getRankRole(guild, maxRating, PERSPECTIVE) {

		if(maxRating > 6000) {
	
			return guild.settings.pubgStats['grandmaster' + PERSPECTIVE];
	
		} else if(maxRating > 5000 && maxRating <= 6000) {
	
			return guild.settings.pubgStats['mestre' + PERSPECTIVE];
	
		} else if(maxRating > 4000 && maxRating <= 5000) {
	
			return guild.settings.pubgStats['diamante' + PERSPECTIVE];
	
		} else if(maxRating > 3000 && maxRating <= 4000) {
	
			return guild.settings.pubgStats['platina' + PERSPECTIVE];
	
		} else if(maxRating > 2000 && maxRating <= 3000) {
	
			return guild.settings.pubgStats['ouro' + PERSPECTIVE];
	
		} else if(maxRating > 1000 && maxRating <= 2000) {
	
			return guild.settings.pubgStats['prata' + PERSPECTIVE];
	
		} else if(maxRating >= 0 && maxRating <= 1000) {
	
			return guild.settings.pubgStats['bronze' + PERSPECTIVE];
		}
	
	}

	static async addRankToPlayer(guild, roleID, discordUserID, PERSPECTIVE, sendMessage, msg) {

		if(!guild.available) {
			return;
		}
	
		let guildMember = guild.member(discordUserID);

		const role = guild.roles.get(roleID);
		if (!role) throw `eu não consegui encontrar a role, ela foi deletada?`;
	
		if(!guildMember) {
			return;
		}
	
		if(guildMember.roles.has(role.id)) {
			return;
		}
	
		await guildMember.roles.remove([
			guild.settings.pubgStats['grandmaster' + PERSPECTIVE],
			guild.settings.pubgStats['desafiante' + PERSPECTIVE],
			guild.settings.pubgStats['mestre' + PERSPECTIVE],
			guild.settings.pubgStats['diamante' + PERSPECTIVE],
			guild.settings.pubgStats['platina' + PERSPECTIVE],
			guild.settings.pubgStats['ouro' + PERSPECTIVE],
			guild.settings.pubgStats['prata' + PERSPECTIVE],
			guild.settings.pubgStats['bronze' + PERSPECTIVE]
		]).catch(err => { throw err; });
	
		await guildMember.roles.add(role).catch(err => { throw err; });

		if(sendMessage) {

			let embedMessage = {
				"embed": {
					"title": "**Você mudou de Rank!**",
					"description": "Agora você está no rank: \n `" + role.name + "`",
					"color": 3861921,
					"thumbnail": {
						"url": msg.author.avatarURL()
					},
					"fields": [],
					"timestamp": new Date()
				}
			}

			msg.author.sendMessage(embedMessage);

		}

	}

	static printErrors(errors) {

		let finalError = '\n';

		if(errors.message) {

			finalError += errors.message;
			return finalError;

		}

		if(typeof errors === 'string') {
			return errors;
		}

		errors.forEach(error => {
			finalError += `${error.title}: ${error.description} \n`;
		});

		return finalError;

	}

};
