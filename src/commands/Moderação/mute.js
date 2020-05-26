const { Command } = require('klasa');
const { Duration } = require('klasa');

const ModLog = require('../../lib/structures/ModLog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			permissionLevel: 2,
			requiredPermissions: ['MANAGE_GUILD', 'MANAGE_ROLES'],
			description: 'Silenciar um usuário em canais de texto e áudio.',
			usage: '<user:member> [reason:str] [...]',
			usageDelim: ' '
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

	async run(msg, [member, muteTime, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const role = msg.guild.roles.get(msg.guild.settings.mod.muterole);
		if (!role) throw `❌ | eu não consegui encontrar a role "mute", ela foi deletada?`;

		if (!muteTime) throw `❌ | ${msg.author}, você deve especificar uma duração para o mute.`;

		if (member.user.bot) throw `❌ | ${msg.author}, eu não posso executar esta ação contra outro bot.`;
		else if (member.roles.highest.position >= msg.member.roles.highest.position) throw `❌ | ${msg.author}, eu não posso executar esta ação contra este usuário.`;
		else if (member.roles.has(role.id)) throw `❌ | ${msg.author}, este usuário já está mutado.`;

		await member.roles.add(role).catch(err => { throw err; });
		await msg.send(`🔇 | **${msg.author.tag}** mutou o usuário **${member.user.tag}** por *${this.resolveDuration(muteTime)}* ${reason ? `devido à *${reason}*.`: 'sem motivo.'}`);

		setTimeout(async () => {
			await member.roles.remove(role).catch(err => { throw err; });
		}, new Duration(this.resolveTime(muteTime)).offset);

		if (msg.guild.settings.mod.modlog) {
			new ModLog(msg.guild)
				.setType('mute')
				.setUser(member.user)
				.setMod(msg.author)
				.setReason(reason)
				.send();
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
