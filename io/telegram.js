const TAG = 'IO.Telegram';
const TelegramBot = require('node-telegram-bot-api');

class Telegram extends require('./iodriver') {
	constructor(cfg) {
		super();
		this.bot = new TelegramBot(cfg.token, cfg.options);

		if (cfg.webhook) {
			var listenUrl = cfg.webhook.url + cfg.token;
			this.bot.setWebHook(listenUrl, cfg.webhook.options);
			this.bot.getWebHookInfo().then((e) => {
				console.info(TAG, 'started', e); 
			});
		}

		this.bot.on('message', (e) => {
			this.emit('message', e);
		});
	}

	output(chatId, e, opts) {
		return new Promise((resolve, reject) => {
			console.io(TAG, chatId, e);
			if (_.isString(e)) e = { text: e };

			if (e.error) return resolve();

			if (e.text) {
				this.bot.sendChatAction(chatId, 'typing');
				this.bot.sendMessage(chatId, e.text, opts);
				return resolve();
			}

			if (e.spotify) {
				this.bot.sendChatAction(chatId, 'typing');
				if (e.spotify.song) {
					this.bot.sendMessage(chatId, e.spotify.song.external_urls.spotify, opts);
					return resolve();
				}
				return reject();
			}

			if (e.photo) {
				this.bot.sendChatAction(chatId, 'upload_photo');
				this.bot.sendPhoto(chatId, e.photo, opts);
				return resolve();
			}

			return reject();
		});
	}
}

module.exports = Telegram;
