const telegram_config = require('../io/config.json').telegram || {};
const irc_config = require('../io/config.json').irc || {};
const relay_config = require('./config.json') || {};

if (IOs.telegram && IOs.irc) {
	IOs.telegram.on('message', (e) => {
		console.ai('Message from Telegram', e);

		// TODO
	});

	IOs.irc.on('message', (from, to, message) => {
		console.ai('Message from IRC:', message);

		if (from == irc_config.nick || to != relay_config.ircChannel) return;

		IOs.telegram.output({
			chatId: relay_config.telegramChat
		}, from + ': ' message);
	});	
}
