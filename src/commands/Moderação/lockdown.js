const { Command } = require('klasa');
const { Duration } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: ['lock'],
			permissionLevel: 2,
			requiredPermissions: ['MANAGE_CHANNELS'],
			description: 'Bloqueia um canal de texto por um tempo pré determinado.',
			usage: '<time:str>'
		});

		this.regex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/ig;

		this.years = ['a', 'ano', 'anos'];
		this.months = ['M', 'mes', 'meses'];
		this.weeks = ['S', 'sem', 'semana', 'semanas'];
		this.days = ['d', 'dia', 'dias'];
		this.hours = ['h', 'hr', 'hora', 'horas'];
		this.minutes = ['m', 'min', 'minuto', 'minutos'];
		this.seconds = ['s', 'segundo', 'segundos'];
	}

	async run(msg, [time]) {
		if (!this.client.lockit) this.client.lockit = [];

		const validUnlocks = ['release', 'unlock'];

		if (!time) throw `❌ | ${msg.author}, você deve especificar uma duração para o bloqueio.`;

		if (validUnlocks.includes(time)) {
			await msg.channel.overwritePermissions(msg.guild.id, { SEND_MESSAGES: null }).catch(err => { throw err; });
			msg.send('🔓 | Chat desbloqueado');
			clearTimeout(this.client.lockit[msg.channel.id]);
			delete this.client.lockit[msg.channel.id];
		} else {
			await msg.channel.overwritePermissions(msg.guild.id, { SEND_MESSAGES: false }).catch(err => { throw err; });
			await msg.send(`🔒 | Chat bloqueado por ${this.resolveDuration(time)}.`);
			this.client.lockit[msg.channel.id] = setTimeout(async () => {
				await msg.channel.overwritePermissions(msg.guild.id, { SEND_MESSAGES: null }).catch(err => { throw err; });
				msg.send('🔓 | Chat desbloqueado.');
				delete this.client.lockit[msg.channel.id];
			}, new Duration(this.resolveTime(time)).offset);
		}
	}

	resolveDuration(dur) {
		let str = '';

		dur.replace(this.regex, (match, p1, p2) => {
			if (this.years.some(ele => ele === p2))	str += ` ${p1} ${p1 > 1 ? 'anos' : 'ano'}`;
			else if (this.months.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'meses' : 'mês'}`;
			else if (this.weeks.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'semanas' : 'semana'}`;
			else if (this.days.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'dias' : 'dia'}`;
			else if (this.hours.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'horas' : 'hora'}`;
			else if (this.minutes.some(ele => ele === p2)) str += ` ${p1} ${p1 > 1 ? 'minutos' : 'minuto'}`;
			else if (this.seconds.some(ele => ele === p2)) 	str += ` ${p1} ${p1 > 1 ? 'segundos' : 'segundo'}`;
		});

		return str.slice(1);
	}

	resolveTime(dur) {
		let str = '';

		dur.replace(this.regex, (match, p1, p2) => {
			if (this.years.some(ele => ele === p2))	str += ` ${p1} y`;
			else if (this.months.some(ele => ele === p2)) str += ` ${p1} b`;
			else if (this.weeks.some(ele => ele === p2)) str += ` ${p1 * 7} d`;
			else if (this.days.some(ele => ele === p2)) str += ` ${p1} d`;
			else if (this.hours.some(ele => ele === p2)) str += ` ${p1} h`;
			else if (this.minutes.some(ele => ele === p2)) str += ` ${p1} m`;
			else if (this.seconds.some(ele => ele === p2)) 	str += ` ${p1} s`;
		});

		return str.slice(1);
	}

};
