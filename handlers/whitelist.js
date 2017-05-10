const TAG = require('path').basename(__filename, '.js');

// TODO create support module for localization
const i18n = require('i18n-nodejs')(config.language || 'en', require('fs').existsSync('../../i18n/' + TAG + '.json') ? '../../i18n/' + TAG + '.json' : '../../i18n/default.json');

class Whitelist {
	constructor(cfg) {
		this._config = cfg || {};

		_.each(this._config.users, function(user) {
			updateUser({
				parameters: user
			});
		});

		_.each(this._config.groups, function(group) {
			updateGroup({
				parameters: group
			});
		});

		_.each(this._config.commands, function(command) {
			updateCommand({
				parameters: command
			});
		});
	}

	listUsers(result, data) {
		let WhitelistUser = require('../memory/models/whitelistUser');

		return WhitelistUser.fetchAll().then(function(collection) {

			return {
				text: collection.map(function(model) {
					return model.get('chatId') + ': ' + model.get('level');
				}).join('\n')
			};
		});
	}

	listGroups(result, data) {

	}

	listCommands(result, data) {
		
	}

	updateUser(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.chatId)) reject();
		_.defaults(item, {
			level: 0
		});

		let WhitelistUser = require('../memory/models/whitelistUser');

		return new WhitelistUser().save(_.pick(item, 'chatId', 'level'), { patch: true })
		.then(function() {
			return {
				text: i18n.__("Successfully added the user with id {{chatId}} and level {{level}}.", item)
			};
		});
	}

	updateGroup(result, data) {
		// TODO
	}

	updateCommand(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.command)) reject();
		_.defaults(item, {
			level: 0
		});

		let WhitelistCommand = require('../memory/models/whitelistCommand');

		return new WhitelistCommand().save(_.pick(item, 'command', 'level'), { patch: true })
		.then(function() {
			return {
				text: i18n.__('Successfully added the command "{{command}}"" with level {{level}}.', item)
			};
		});
	}

	delete(result, data) {
		// TODO
	}

	validate(result, data) {
		// TODO
	}
}

module.exports = Whitelist;
