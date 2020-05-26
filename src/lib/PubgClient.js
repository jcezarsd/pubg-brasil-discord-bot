const settings = require('../../settings.json');

const pubgRoyale = require('pubg-royale');

module.exports = new pubgRoyale.Client({
	// Put your api key here
	key: settings.pubgApiKey,
  
	// Default region used for api calls. Defaults to "steam" if omitted.
	// The region can be set for individual api calls.
	defaultRegion: pubgRoyale.REGIONS.PC.STEAM,
  
	// Specifies ttl in ms for cached objects. Any value ommited defaults to 60 seconds.
	// Set every value to zero to disable caching
	cache: { 
		player: 10 * 1000,
		playerStats: 10 * 1000,
		match: 10 * 1000,
		status: 10 * 1000,
		seasons: 10 * 1000,
	},
});