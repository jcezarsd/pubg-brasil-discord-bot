class PUBGPlayer {

	constructor(guild) {

		Object.defineProperty(this, 'guild', { value: guild });
		Object.defineProperty(this, 'client', { value: guild.client });

		this.table = 'pubgPlayer';

		this.player = null;

		this.init();
	}

	async init() {
		if (!(await this.provider.hasTable(this.table))) await this.provider.createTable(this.table);
	}

	async create(player) {
		await this.provider.create(this.table, player.id, Object.assign({}, player));
		return this.provider.get(this.table, player.id);
	}

	async update(player) {
		await this.provider.update(this.table, player.id, Object.assign({}, player));
		return this.provider.get(this.table, player.id);
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

module.exports = PUBGPlayer;