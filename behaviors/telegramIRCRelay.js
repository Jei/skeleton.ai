const telegram_config = require('../io/config.json').telegram || {};
const irc_config = require('../io/config.json').irc || {};
const _config = require('./config.json') || {};

if (IOs.telegram && IOs.irc && _config.telegramIRCRelay) {
	const relay_config = _config.telegramIRCRelay;

	IOs.telegram.on('message', (e) => {
		console.info('Message from Telegram', e);

		// TODO support different types of messages
		if (e.chat.id != relay_config.telegramChatId || e.text == null) return;

		let from = e.from.username;

		if (from == null) {
			from = e.from.first_name + (e.from.last_name != null ? ' ' + e.from.last_name : '');
		}

		IOs.irc.output(relay_config.ircChannel, 'Telegram.' + from + ': ' + e.text);
	});

	IOs.irc.on('message', (from, to, message) => {
		console.info('Message from IRC:', from + ' => ' + to + ' : ' + message);

		if (from == irc_config.nick || to != relay_config.ircChannel) return;

		IOs.telegram.output(relay_config.telegramChatId, 'IRC.' + from + ': ' + message);
	});	
}
