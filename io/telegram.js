const TAG = 'IO.Telegram';
const _config = require('./config.json').telegram || {};
const TelegramBot = require('node-telegram-bot-api');

class Telegram extends require('./iodriver') {
	constructor() {
		super();
		this.bot = new TelegramBot(_config.token, _config.options);

		if (_config.webhook) {
			var listenUrl = _config.webhook.url + _config.token;
			this.bot.setWebHook(listenUrl, _config.webhook.options);
			this.bot.getWebHookInfo().then((e) => {
				console.info(TAG, 'started', e); 
			});
		}

		this.bot.on('message', (e) => {
			this.emit('message', e);
		});
	}

	output(data, e) {
		return new Promise((resolve, reject) => {
			console.ai(TAG, e);
			if (_.isString(e)) e = { text: e };

			if (e.error) return resolve();

			if (e.text) {
				this.bot.sendChatAction(data.chatId, 'typing');
				this.bot.sendMessage(data.chatId, e.text);
				return resolve();
			}

			if (e.spotify) {
				this.bot.sendChatAction(data.chatId, 'typing');
				if (e.spotify.song) {
					this.bot.sendMessage(data.chatId, e.spotify.song.external_urls.spotify);
					return resolve();
				}
				return reject();
			}

			if (e.photo) {
				this.bot.sendChatAction(data.chatId, 'upload_photo');
				this.bot.sendPhoto(data.chatId, e.photo);
				return resolve();
			}

			return reject();
		});
	}
}

module.exports = Telegram;
