const Pomocnik = require('./lib/Pomocnik');

const { token } = require('../settings.json');

const client = new Pomocnik({
	prefix: '!',
	cmdEditing: true,
	providers: { default: 'rethinkdb' },
	fetchAllMembers: true,
	disabledEvents: [
		'TYPING_START',
		'RELATIONSHIP_ADD',
		'RELATIONSHIP_REMOVE',
		'CHANNEL_PINS_UPDATE',
		'PRESENCE_UPDATE',
		'USER_UPDATE',
		'USER_NOTE_UPDATE'
	]
});

return client.login(token);
