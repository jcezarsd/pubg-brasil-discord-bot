const Stats = require('./Stats');

const MATCHFPP = {
	SOLOFPP: 'soloFPP',
	DUOFPP: 'duoFPP',
	SQUADFPP: 'squadFPP'
};

const MATCHTPP = {
	SOLO: 'solo',
	DUO: 'duo',
	SQUAD: 'squad'
};

class Player {

    constructor(id, content, perspective) {

		this.id = id;
		
		if(content.data[0] && content.data[0].attributes) {
		
			this.pubgID = content.data[0].id;

			this.nick = content.data[0].attributes.name;
		
		}
		
		if(content.data.attributes && content.data.attributes.gameModeStats) {

			if(perspective === 'Fpp') {

				this.soloFPP = new Stats(content.data.attributes.gameModeStats['solo-fpp']);
				this.duoFPP = new Stats(content.data.attributes.gameModeStats['duo-fpp']);
				this.squadFPP = new Stats(content.data.attributes.gameModeStats['squad-fpp']);
				
				this.fppUpdatedAt = new Date();
				this.maxRatingFpp = this.getMaxRatingFPP(this);

			} else if(perspective === 'Tpp') {

				this.solo = new Stats(content.data.attributes.gameModeStats.solo);
				this.duo = new Stats(content.data.attributes.gameModeStats.duo);
				this.squad = new Stats(content.data.attributes.gameModeStats.squad);

				this.tppUpdatedAt = new Date();
				this.maxRatingTpp = this.getMaxRatingTPP(this);

			}

		}

	}

	getMaxRatingFPP(playerStats) {

		let maxRating = -1;
	
		Object.keys(MATCHFPP).forEach(function (match) {
	
			let matchType = MATCHFPP[match];
			let rating = playerStats[matchType].rankPoints;
	
			if(rating > maxRating) {
				maxRating = rating;
			}
	
		});
	
		return maxRating;
	
	};

	getMaxRatingTPP(playerStats) {

		let maxRating = -1;
	
		Object.keys(MATCHTPP).forEach(function (match) {
	
			let matchType = MATCHTPP[match];
			let rating = playerStats[matchType].rankPoints;
	
			if(rating > maxRating) {
				maxRating = rating;
			}
	
		});
	
		return maxRating;
	
	};

}

module.exports = Player;
