const { MessageEmbed } = require('discord.js');

module.exports = class ModLog {

	constructor(guild) {
		Object.defineProperty(this, 'guild', { value: guild });

		Object.defineProperty(this, 'client', { value: guild.client });

		this.type = null;
		this.user = null;
		this.moderator = null;
		this.reason = null;
		this.case = null;
	}

	setType(type) {
		this.type = type;
		return this;
	}

	setUser(user) {
		this.user = {
			id: user.id,
			tag: user.tag
		};
		return this;
	}

	setMod(mod) {
		this.moderator = {
			id: mod.id,
			tag: mod.tag
		};
		return this;
	}

	setReason(reason) {
		this.reason = reason;
		return this;
	}

	async send() {
		const modlog = await this.guild.channels.get(this.guild.settings.mod.modlog);
		if (!modlog) throw 'The modlog channel does not exist. Where did it go?';
		this.case = await this.getCase();
		return modlog.send({ embed: this.embed });
	}

	async getCase() {
		const row = await this.provider.get('modlogs', this.guild.id);
		if (!row) {
			this.case = 1;
			return this.provider.create('modlogs', this.guild.id, { modlogs: [this.pack] }).then(() => 1);
		}
		this.case = row.modlogs.length + 1;
		row.modlogs.push(this.pack);
		await this.provider.replace('modlogs', this.guild.id, row);
		return row.modlogs.length;
	}

	get pack() {
		return {
			type: this.type,
			user: this.user,
			moderator: this.moderator,
			reason: this.reason,
			case: this.case
		};
	}

	get embed() {
		const embed = new MessageEmbed()
			.setColor(ModLog.color(this.type))
			.setTitle(`Usuário ${ModLog.title(this.type)}`)
			.setDescription([
				`**Membro**: ${this.user.tag} | ${this.user.id}`,
				`**Moderador**: ${this.moderator.tag} | ${this.moderator.id}`,
				`**Motivo**: ${this.reason || `Nenhum motivo especificado. Digite '${this.guild.settings.prefix}reason <case#>' para adicionar um motivo para esse caso.`}`
			])
			.setFooter(`Case ${this.case}`, this.client.user.displayAvatarURL({ format: 'jpg' }))
			.setTimestamp();
		return embed;
	}

	static color(type) {
		switch (type) {
			case 'ban': return 0xcc0000;
			case 'unban': return 0x2d862d;
			case 'kick': return 0xe65c00;
			case 'mute': return 0xf2f20d;
			case 'unmute': return 0x993366;
			case 'warn': return 0xf2f20d;
			case 'flag': return 0xf2f20d;
			default: return 0xffffff;
		}
	}

	static title(type) {
		switch (type) {
			case 'ban': return 'Banido';
			case 'unban': return 'Desbanido';
			case 'mute': return 'Mutado';
			case 'unmute': return 'com mute removido';
			case 'kick': return 'Kickado';
			case 'warn': return 'Avisado';
			case 'flag': return 'com Flag';
			default: return '{{Unknown Action}}';
		}
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
