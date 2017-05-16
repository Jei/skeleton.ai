const TAG = require('path').basename(__filename, '.js');

// TODO create support module for localization
const i18n = require('i18n-nodejs')(config.language || 'en', require('fs').existsSync('../../i18n/' + TAG + '.json') ? '../../i18n/' + TAG + '.json' : '../../i18n/default.json');

const CONFIG_MODELS_MAP = {
	users: 'whitelistUser',
	groups: 'whitelistGroup',
	commands: 'whitelistCommand',
}

function getModel(item, type) {
	if (_.isEmpty(type)) return Promise.reject();

	let Model = require('../memory/models/' + type);

	return new Model(item).fetch();
}

function addModel(obj, type) {
	if (_.isEmpty(obj) || _.isEmpty(type)) return Promise.reject();

	let Model = null;

	try {
		Model = require('../memory/models/' + type);
	} catch(e) {
		console.error(e);
		return Promise.reject();
	}

	return new Model(obj).save(null, { method: 'insert' });
}

function updateModel(where, obj, type) {
	if (_.isEmpty(obj) || _.isEmpty(type) || _.isEmpty(obj)) return Promise.reject();

	let Model = null;

	try {
		Model = require('../memory/models/' + type);
	} catch(e) {
		console.error(e);
		return Promise.reject();
	}

	return new Model(where).save(obj, { patch: true });
}

function listCollection(type) {
	if (_.isEmpty(type)) return Promise.reject();

	let Model = require('../memory/models/' + type);

	return Model.fetchAll()
		.then(function(collection) {
			return { 
				text: collection.map(function(model) {
					return model.id + ': ' + model.get('level');
				}).join('\n')
			};
		})
		.catch(function(err) {
			console.error(err);
			return Promise.reject();
		});
}

class Whitelist {
	constructor(cfg) {
		let self = this;
		self._config = cfg || {};
	}

	__init() {
		let self = this;

		_.each(CONFIG_MODELS_MAP, function(type, name) {
			_.each(self._config[name], function(item) {
				addModel(item, type)
					.catch(function(err) {
						getModel(_.omit(item, 'level'), type)
							.then(function(model) {
								if (model == null) {
									console.error(TAG, err);
								}
							});
					});
			});
		});
	}

	listUsers(result, data) {
		return listCollection('whitelistUser');
	}

	listGroups(result, data) {
		return listCollection('whitelistGroup');
	}

	listCommands(result, data) {
		return listCollection('whitelistCommand');
	}

	addUser(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.chatId)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		return addModel(item, 'whitelistUser')
			.then(function() {
				return {
					text: i18n.__("Successfully added the user with id {{chatId}} and level {{level}}.", item)
				};
			});
	}

	updateUser(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.chatId)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		return updateModel({ chatId: item.chatId }, { level: item.level }, 'whitelistUser')
			.then(function() {
				return {
					text: i18n.__('Successfully updated the user with id {{chatId}} and level {{level}}.', item)
				};
			})
			.catch(function() {
				return addModel(item, 'whitelistUser')
					.then(function() {
						return {
							text: i18n.__("Successfully added the user with id {{chatId}} and level {{level}}.", item)
						};
					});
			});
	}

	addGroup(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.groupId)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		return addModel(item, 'whitelistGroup')
			.then(function() {
				return {
					text: i18n.__('Successfully added the group "{{groupId}}" with level {{level}}.', item)
				};
			});
	}

	updateCommand(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.groupId)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		return updateModel({ groupId: item.groupId }, {level: item.level }, 'whitelistGroup')
			.then(function() {
				return {
					text: i18n.__('Successfully updated the group "{{groupId}}" with level {{level}}.', item)
				};
			})
			.catch(function(err) {
				return addModel(item, 'whitelistGroup')
					.then(function() {
						return {
							text: i18n.__('Successfully added the group "{{groupId}}"" with level {{level}}.', item)
						};
					});
			});
	}

	addCommand(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.command)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		return addModel(item, 'whitelistCommand')
			.then(function() {
				return {
					text: i18n.__('Successfully added the command "{{command}}" with level {{level}}.', item)
				};
			});
	}

	updateCommand(result, data) {
		result = result || {};

		let item = result.parameters || {};

		if (_.isEmpty(item.command)) return Promise.reject();
		_.defaults(item, {
			level: 0
		});

		return updateModel({ command: item.command }, {level: item.level }, 'whitelistCommand')
			.then(function() {
				return {
					text: i18n.__('Successfully updated the command "{{command}}"" with level {{level}}.', item)
				};
			})
			.catch(function(err) {
				return addModel(item, 'whitelistCommand')
					.then(function() {
						return {
							text: i18n.__('Successfully added the command "{{command}}"" with level {{level}}.', item)
						};
					});
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
				function(result,err) {
					return { result: result, status: required ? "rejected" : "resolved" };
				}
			);
		}

		function getModel(idAttr, id, type) {
			if (id == null) return Promise.reject();

			let Model = require('../memory/models/' + type);
			let base = {};
			base[idAttr] = id;

			return new Model(base).fetch();
		}

		let promises = [
			reflect(getModel('chatId', params.chatId, 'whitelistUser'), true), // TODO optional non strict mode
			reflect(getModel('groupId', params.groupId, 'whitelistGroup'), params.groupId != null),
			reflect(getModel('command', params.command, 'whitelistCommand'), params.command != null)
		]

		return Promise.all(promises).then(function(results) {
			if (_.any(results, function(res) { return res.status == "rejected"; })) return Promise.reject();

			let user = results[0].result;
			let group = results[1].result;
			let command = results[2].result;

			if (command && command.get('level') > user.get('level')) return Promise.reject();
			if (command && group && command.get('level') > group.get('level')) return Promise.reject();

			return Promise.resolve();
		});
	}
}

module.exports = Whitelist;
