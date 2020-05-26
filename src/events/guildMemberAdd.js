const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	run(member) {
		const channel = member.guild.channels.get(member.guild.settings.mod.modlog);

		if (!channel) throw `❌ | I could not find a 'modlog' channel. Was it deleted?`;

		const embed = new MessageEmbed()
			.setAuthor(member.user.tag, member.user.displayAvatarURL({ format: 'png' }))
			.setColor(0x99e052)
			.setFooter('User Joined')
			.setTimestamp();
		return channel.send({ embed });
	}

};
