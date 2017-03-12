const telegram_config = require('../io/config.json').telegram || {};
const irc_config = require('../io/config.json').irc || {};
const _config = require('./config.json') || {};

if (IOs.telegram && IOs.irc && _config.telegramIRCRelay) {
	const relay_config = _config.telegramIRCRelay;

	IOs.telegram.on('message', (e) => {
		console.ai('Message from Telegram', e);

		// TODO support different types of messages
		if (e.chat.id != relay_config.telegramChatId || e.text == null) return;

		let from = e.from.username;

		if (from == null) {
			from = e.from.first_name + (e.from.last_name != null ? ' ' + e.from.last_name : '');
		}

		IOs.irc.output({
			target: relay_config.ircChannel
		}, from + ': ' + e.text);
	});

	IOs.irc.on('message', (from, to, message) => {
		console.ai('Message from IRC:', from + ' => ' + to + ' : ' + message);

		if (from == irc_config.nick || to != relay_config.ircChannel) return;

		IOs.telegram.output({
			chatId: relay_config.telegramChatId
		}, from + ': ' + message);
	});	
}
