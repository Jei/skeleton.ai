const telegram_config = config.ioDrivers.telegram || {};
const irc_config = config.ioDrivers.irc || {};
const _config = config.behaviors.telegramIRCRelay || {};

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

		IOs.telegram.output(_config.telegramChatId, 'IRC.' + from + ': ' + message);
	});	
}
