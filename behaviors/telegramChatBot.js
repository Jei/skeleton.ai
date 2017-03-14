const telegram_config = require('../io/config.json').telegram || {};
const _config = require('./config.json') || {};

if (IOs.telegram && IOs.irc && _config.telegramChatBot) {
	const bot_config = _config.telegramChatBot;

	IOs.telegram.on('message', (e) => {
		console.info('Message from Telegram', e);

		// TODO support different types of messages
		// TODO check whitelist/blacklist
	});
}