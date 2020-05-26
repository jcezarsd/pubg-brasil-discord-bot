const { KlasaClient } = require("klasa");

module.exports = KlasaClient.defaultGuildSchema

	.add('mod', folder => folder
		.add('modlog', 'textchannel')
		.add('chatBan', 'textchannel')
		.add('muterole', 'role')
		.add('modRole', 'role')
		.add('staffRole', 'role')
		.add('adminRole', 'role')
		.add('flagRole', 'role'))

	.add('pubgStats', folder => folder

		.add('rankChat', 'textchannel')

		.add('bronzeTpp', 'role')
		.add('prataTpp', 'role')
		.add('ouroTpp', 'role')
		.add('platinaTpp', 'role')
		.add('diamanteTpp', 'role')
		.add('mestreTpp', 'role')
		.add('desafianteTpp', 'role')
		.add('grandmasterTpp', 'role')

		.add('bronzeFpp', 'role')
		.add('prataFpp', 'role')
		.add('ouroFpp', 'role')
		.add('platinaFpp', 'role')
		.add('diamanteFpp', 'role')
		.add('mestreFpp', 'role')
		.add('desafianteFpp', 'role')
		.add('grandmasterFpp', 'role')
		
		.add('season', 'string'));