const { Task } = require('klasa');

const FlagUser = require('../lib/structures/FlagUser');
const moment = require('moment');
const _ = require('lodash');

module.exports = class extends Task {

	async run() {

		let guild = this.client.guilds.first();
		let flagUser = new FlagUser(guild);
		let flagList = await flagUser.getAll();

		if(typeof flagList !== "undefined" && flagList !== null) {
			
			console.log('Existem ' + flagList.length + ' usuários com flag.');

			_.forEach(flagList, function(user) {

				let flagDate = moment(user.flagDate);

				if(user.flagTime > 0) {

					if(moment() > flagDate.add(user.flagTime, 'd')) {

						flagUser.delete(user.id);
						guild.members.unban(user.id)
							.then(console.log(`Foi retirado o ban do player ${user.discordUser.displayName}(${user.discordUser.userId}).`))
							.catch(error => console.log(`Não foi possível retirar o ban do player ${user.discordUser.displayName}(${user.discordUser.userId}) pois: ${error}`));
						
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