// Packages
const { Client } = require('klasa');
const permissionLevels = require("./PermissionLevels");
const defaultGuildSchema = require(`./defaultGuildSchema`);

module.exports = class Pomocnik extends Client {

	constructor(options) {
		super({ ...options, permissionLevels, defaultGuildSchema });
	}

	async login(token) {
		return super.login(token);
	}

	setup() {}

	async validate() {}

};
