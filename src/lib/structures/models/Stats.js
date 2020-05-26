class Stats {

    constructor(content) {

		this.assists = content.assists ? content.assists : 0;
		this.bestRankPoint = content.bestRankPoint ? content.bestRankPoint: 0;
		this.boosts = content.boosts ? content.boosts : 0;
		this.dBNOs = content.dBNOs ? content.dBNOs : 0;
		this.dailyKills = content.dailyKills ? content.dailyKills : 0;
		this.damageDealt = content.damageDealt ? content.damageDealt : 0;
		this.days = content.days ? content.days : 0;
		this.dailyWins = content.dailyWins ? content.dailyWins : 0;
		this.headshotKills = content.headshotKills ? content.headshotKills : 0;
		this.heals = content.heals ? content.heals : 0;
		// this.killPoints = content.killPoints ? Math.round(content.killPoints * 100) / 100 : 0;
		this.kills = content.kills ? content.kills : 0;
		this.longestKill = content.longestKill ? content.longestKill : 0;
		this.longestTimeSurvived = content.longestTimeSurvived ? content.longestTimeSurvived : 0;
		this.losses = content.losses ? content.losses : 0;
		this.maxKillStreaks = content.maxKillStreaks ? content.maxKillStreaks : 0;
		this.mostSurvivalTime = content.mostSurvivalTime ? content.mostSurvivalTime : 0;
		this.rankPoints = content.rankPoints ? content.rankPoints : 0;
		this.revives = content.revives ? content.revives : 0;
		this.rideDistance = content.rideDistance ? content.rideDistance : 0;
		this.roadKills = content.roadKills ? content.roadKills : 0;
		this.roundMostKills = content.roundMostKills ? content.roundMostKills : 0;
		this.roundsPlayed = content.roundsPlayed ? content.roundsPlayed : 0;
		this.suicides = content.suicides ? content.suicides : 0;
		this.swimDistance = content.swimDistance ? content.swimDistance : 0;
		this.teamKills = content.teamKills ? content.teamKills : 0;
		this.timeSurvived = content.timeSurvived ? content.timeSurvived : 0;
		this.top10s = content.top10s ? content.top10s : 0;
		this.vehicleDestroys = content.vehicleDestroys ? content.vehicleDestroys : 0;
		this.walkDistance = content.walkDistance ? content.walkDistance : 0;
		this.weaponsAcquired = content.weaponsAcquired ? content.weaponsAcquired : 0;
		this.weeklyKills = content.weeklyKills ? content.weeklyKills : 0;
		this.weeklyWins = content.weeklyWins ? content.weeklyWins : 0;
		// this.winPoints = content.winPoints ? content.winPoints : 0;
		this.wins = content.wins ? content.wins : 0;
		this.kd = this.getKillDeathRatio();

    }

    getItem(name) {

        if (!name || !typeof name === 'string') return;
		return this.stats.find(s => s.name === name);
		
	}
	
	getKillDeathRatio() {

		let death = this.roundsPlayed - this.wins;

		let kd = death == 0 ? (this.kills / this.roundsPlayed) : (this.kills / death);

		kd = Math.round(kd * 100) / 100;

		return kd ? kd : 0;

	}

	getRating() {

		// let rating = this.winPoints + (this.killPoints * 0.2);
		let rating = this.rankPoints;

		rating = Math.round(rating);

		return rating;

	}

}

module.exports = Stats;