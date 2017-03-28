const TAG = 'IO.Telegram';
const TelegramBot = require('node-telegram-bot-api');

function splitMessage(text) {
	return text.match(/([^\s][\w\W\n]{0,4096})(?=\n[\w\W\n]*|$)/gi); // Split a string in parts of 4096 characters at most, ending with newline.
}

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

			let self = this;

			if (e.text) {
				self.bot.sendChatAction(chatId, 'typing');
				_.each(splitMessage(e.text), function(part) {
					self.bot.sendMessage(chatId, part, opts);
				});
				return resolve();
			}

			if (e.spotify) {
				self.bot.sendChatAction(chatId, 'typing');
				if (e.spotify.song) {
					self.bot.sendMessage(chatId, e.spotify.song.external_urls.spotify, opts);
					return resolve();
				}
				return reject();
			}

			if (e.photo) {
				self.bot.sendChatAction(chatId, 'upload_photo');
				self.bot.sendPhoto(chatId, e.photo, opts);
				return resolve();
			}

			return reject();
		});
	}
}

module.exports = Telegram;
