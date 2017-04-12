const telegram_config = config.ioDrivers.telegram || {};
const _config = config.behaviors.telegramChatBot || {};

function performCommand(text, entity) {
	const command_text = text.substr(entity.offset+1, entity.length);
	let match = command_text.match(/^([a-z]+)[A-Z]?/);

	if (match != null && match[1] != null) {
		let handler_name = match[1];
		let method = command_text.substring(handler_name.length);
		let params = text.substring(entity.offset + entity.length);
		let next_cmd_pos = params.indexOf('/');
		if (next_cmd_pos >= 0) {
			params = params.substring(0, next_cmd_pos);
		}
		params = _.compact(params.split(' '));

		if (!_.isEmpty(method)) {

			if (!_.isFunction(Handlers[handler_name])) {
				return Promise.reject('Handler not found: ' + handler_name);
			}

			let Handler = Handlers[handler_name]();

			return Handler.apply(method, Handler, params);
		} else if (_.isFunction(Handlers[command_text])) {
			// TODO check if action is class?
			return Handlers[command_text](params);
		} else {
			return Promise.reject('Method not found: ' + command_text);
		}
	} else {
		return Promise.reject('Could not parse entity: ' + command_text);
	}
}

if (IOs.telegram && AIs.apiai && _config) {
	IOs.telegram.on('message', (e) => {
		console.info('Message from Telegram', e);

		// TODO Improve whitelist/blacklist
		if (!require('../support/configWhitelist').isAllowed(e.chat.id)) {
			return;
		}

		// Handle commands OR text
		// TODO handle commands AND text?
		let commands = _.where(e.entities, {type: 'bot_command'});

		if (commands.length > 0) {
			_.each(commands, function(entity) {
				performCommand(e.text, entity)
				.then((result) => {
					IOs.telegram.output(e.chat.id, result);
				})
				.catch((err) => {
					// TODO send error message?
					console.error(err);
				});
			});
		} else if (e.text) {
			let text = e.text.replace(new RegExp('(' + _config.aiAliases.join('|') + ')'), '');

			AIs.apiai.textRequest({
				sessionId: e.chat.id
			}, text)
			.then((result) => {
				IOs.telegram.output(e.chat.id, result);
			})
			.catch((err) => {
				// TODO send error message?
				console.error(err);
			});
		}
	});
}
