const moment = require('moment');

class FlagUser {

	constructor(guild) {

		Object.defineProperty(this, 'guild', { value: guild });
		Object.defineProperty(this, 'client', { value: guild.client });

		this.table = 'flagUsers';

		this.user = null;

		this.init();
	}

	async init() {
		if (!(await this.provider.hasTable(this.table))) await this.provider.createTable(this.table);
	}

	async create(user, flagTime, reason) {
		await this.provider.create(this.table, user.id, { discordUser: user, flagTime: flagTime, reason: reason, flagDate: new Date()});
		return this.provider.get(this.table, user.id);
	}

	async get(id) {
		return this.provider.get(this.table, id);
	}

	async getAll() {
		return this.provider.getAll(this.table);
	}

	async delete(id) {
		return this.provider.delete(this.table, id);
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

}

module.exports = FlagUser;