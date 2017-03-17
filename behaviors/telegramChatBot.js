const telegram_config = config.ioDrivers.telegram || {};
const _config = config.behaviors.telegramChatBot || {};

if (IOs.telegram && AIs.apiai && _config) {
	IOs.telegram.on('message', (e) => {
		console.info('Message from Telegram', e);

		// TODO Improve whitelist/blacklist
		if (!require('../support/configWhitelist').isAllowed(e.chat.id)) {
			return;
		}

		// TODO Support different types of messages
		if (e.text) {
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
