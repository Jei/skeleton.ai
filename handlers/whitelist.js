const TAG = require('path').basename(__filename, '.js');

// TODO create support module for localization
const i18n = require('i18n-nodejs')(config.language || 'en', require('fs').existsSync('../../i18n/' + TAG + '.json') ? '../../i18n/' + TAG + '.json' : '../../i18n/default.json');

class Whitelist {
	constructor(cfg) {
		let self = this;
		self._config = cfg || {};
	}

	__init() {
		let self = this;

		_.each(self._config.users, function(user) {
			self.updateUser({
				parameters: user
			});
		});

		_.each(self._config.groups, function(group) {
			self.updateGroup({
				parameters: group
			});
		});

		_.each(self._config.commands, function(command) {
			self.updateCommand({
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

		if (_.isEmpty(item.chatId)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		let WhitelistUser = require('../memory/models/whitelistUser');

		return new WhitelistUser(_.pick(item, 'chatId', 'level')).save()
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

		if (_.isEmpty(item.command)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		let WhitelistCommand = require('../memory/models/whitelistCommand');

		return new WhitelistCommand(_.pick(item, 'command', 'level')).save()
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
		result = result || {};

		let params = result.parameters || {};

		function reflect(promise, required) {
			return promise.then(
				function(result) {
					return { result: result, status: result == null && required ? "rejected" : "resolved" };
				},
				function(result) {
					return { result: result, status: required ? "rejected" : "resolved" };
				}
			);
		}

		function getModel(idAttr, id, type) {
			if (_.isEmpty(id)) return Promise.reject();

			let Model = require('../memory/models/' + type);
			let base = {};
			base[idAttr] = id;

			return new Model(base).fetch();
		}

		let promises = [
			reflect(getModel('idChat', params.chatId, 'whitelistUser'), true), // TODO optional non strict mode
			reflect(getModel('idGroup', params.groupId, 'whitelistGroup'), params.groupId != null),
			reflect(getModel('command', params.command, 'whitelistCommand'), params.command != null)
		]

		return Promise.all(promises).then(function(results) {
			if (_.any(results, function(res) { return res.status == "rejected" })) return false;

			let user = results[0].result;
			let group = results[1].result;
			let command = results[2].result;

			if (command && command.get('level') > user.get('level')) return false;
			if (command && group && command.get('level') > group.get('level')) return false;

			return true;
		});
	}
}

module.exports = Whitelist;
