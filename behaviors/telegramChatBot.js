const telegram_config = config.ioDrivers.telegram || {};
const _config = config.behaviors.telegramChatBot || {};

if (IOs.telegram && AIs.apiai && _config) {
	IOs.telegram.on('message', (e) => {
		console.info('Message from Telegram', e);

		// TODO support different types of messages
		// TODO check whitelist/blacklist
		if (e.text) {
			AIs.apiai.textRequest(null, e.text)
			.then((result) => {
				console.info(result);
			})
			.catch((err) => {
				console.error(err);
			});
		}
	});
}