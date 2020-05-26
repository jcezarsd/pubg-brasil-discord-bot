const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, { spamProtection: false });
	}

	async run(msg, cmd) {

		if (cmd.category === 'PUBGStats' && msg.guild.settings.pubgStats.rankChat) {

			if (msg.channel.id !== msg.guild.settings.pubgStats.rankChat) {

				msg.delete()
				return 'O comando que você digitou só é permitido no chat <#' + msg.guild.settings.pubgStats.rankChat + '>';

			}

		}

	}

};
