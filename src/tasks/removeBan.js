const { Task } = require('klasa');

const BanUser = require('../lib/structures/BanUser');
const moment = require('moment');
const _ = require('lodash');

module.exports = class extends Task {

	async run() {

		let guild = this.client.guilds.first();
		let banUser = new BanUser(guild);
		let bansList = await banUser.getAll();

		if(typeof bansList !== "undefined" && bansList !== null) {
			
			console.log('Existem ' + bansList.length + ' usuários banidos.');

			_.forEach(bansList, function(bannedUser) {

				let banDate = moment(bannedUser.banDate);

				if(bannedUser.banTime > 0) {

					if(moment() > banDate.add(bannedUser.banTime, 'd')) {

						banUser.delete(bannedUser.id);
						guild.members.unban(id)
							.then(console.log(`Foi retirado o ban do player ${bannedUser.user.displayName}(${bannedUser.user.userId}).`))
							.catch(error => console.log(`Não foi possível retirar o ban do player ${bannedUser.user.displayName}(${bannedUser.user.userId}) pois: ${error}`));
						
					}

				}


			});

		}
		
	}

	async init() {

        if(!this.client.settings.schedules.some(schedule => schedule.taskName === this.name)) {

			await this.client.schedule.create(this.name, "0 0 * * *");

		}
		
    }

};