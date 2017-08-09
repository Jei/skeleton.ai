const telegram_config = config.ioDrivers.telegram || {};
const irc_config = config.ioDrivers.irc || {};
const _config = config.behaviors.telegramIRCRelay || {};

function performCommand(text, entity) {
	let command_text = text.substr(entity.offset+1, entity.length-1);
	let match = command_text.match(/^([a-z]+)[A-Z]?/);

	if (match != null && match[1] != null) {
		let handler_name = match[1];
		let method = command_text.substring(handler_name.length);
		if (method.length > 0) {
			method = method.substring(0,1).toLowerCase() + method.substring(1);
		}
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

			return Handler[method].apply(Handler, params);
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


if (IOs.telegram && IOs.irc && _config) {
    IOs.telegram.on('message', (e) => {
        console.info('Message from Telegram', e);

        // TODO support different types of messages
        if (e.chat.id != _config.telegramChatId || e.text == null) return;

        let from = e.from.username;

        if (from == null) {
            from = e.from.first_name + (e.from.last_name != null ? ' ' + e.from.last_name : '');
        }

        let parts = e.text ? e.text.split('\n') : [];

        parts.forEach(function(part) {
            IOs.irc.output(_config.ircChannel, 'Telegram.' + from + ': ' + part);
        });
    });

    IOs.irc.on('message', (from, to, message) => {
        console.info('Message from IRC:', from + ' => ' + to + ' : ' + message);

        if (from == irc_config.nick || to != _config.ircChannel) return;

        if (Boolean(_config.telegramFirehose) == true) {
            IOs.telegram.output(_config.telegramChatId, 'IRC.' + from + ': ' + message);
            return;
        }

		const command = /^(\![a-z0-9]+) /.exec(message);

        if (command && command[1] === "!telegram") {
			IOs.telegram.output(_config.telegramChatId, 'IRC.' + from + ': ' + message.replace('!telegram ', ''));
        }
    });
}
