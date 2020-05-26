const { PermissionLevels } = require("klasa");

module.exports = new PermissionLevels()
	.add(0, () => true)
	.add(2, (client, msg) => {
		if (!msg.guild || !msg.guild.settings.mod.staffRole) return false;
		const staffRole = msg.guild.roles.get(msg.guild.settings.mod.staffRole);
		return staffRole && msg.member.roles.has(staffRole.id);
	})
	.add(3, (client, msg) => {
		if (!msg.guild || !msg.guild.settings.mod.modRole) return false;
		const modRole = msg.guild.roles.get(msg.guild.settings.mod.modRole);
		return modRole && msg.member.roles.has(modRole.id);
	})
	.add(4, (client, msg) => {
		if (!msg.guild || !msg.guild.settings.mod.adminRole) return false;
		const adminRole = msg.guild.roles.get(msg.guild.settings.mod.adminRole);
		return adminRole && msg.member.roles.has(adminRole.id);
	})
	.add(6, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
	.add(7, (client, msg) => msg.guild && msg.member === msg.guild.owner)
	.add(9, (client, msg) => msg.author === client.owner, {break: true})
	.add(10, (client, msg) => msg.author === client.owner);