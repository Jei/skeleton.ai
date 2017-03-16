const TAG = 'IO.IRC';
const IRCBot = require('irc');

class IRC extends require('./iodriver') {
	constructor(cfg) {
		super();
		this.bot = new IRCBot.Client(cfg.serverUrl, cfg.nick, cfg.options);

		this.bot.addListener('message', (from, to, message) => {
			this.emit('message', from, to, message);
		});

		this.bot.addListener('registered', (message) => {
			console.io(TAG, 'registered to the server ' + message.server);
		});

		this.bot.addListener('join', (channel, nick, message) => {
			console.io(TAG, nick + ' joined ' + channel);
		});

		this.bot.addListener('part', (channel, nick, reason, message) => {
			console.io(TAG, nick + ' parted ' + channel + ' (reason: ' + reason + ')');
		});

		this.bot.addListener('error', (e) => {
			console.error(TAG, e);
		});
	}

	output(target, e, opts) {
		return new Promise((resolve, reject) => {
			console.io(TAG, e);
			if (_.isString(e)) e = { text: e };

			if (e.error) return resolve();

			if (e.text) {
				this.bot.say(target, e.text);
				return resolve();
			}

			if (e.spotify) {
				if (e.spotify.song) {
					this.bot.say(target, e.spotify.song.external_urls.spotify);
					return resolve();
				}
				return reject();
			}

			return reject();
		});
	}
}

module.exports = IRC;
