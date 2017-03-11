const TAG = 'IO.IRC';
const _config = require('./config.json').telegram || {};
const IRCBot = require('irc');

class IRC extends require('./iodriver') {
	constructor() {
		super();
		this.bot = new irc.Client(_config.serverUrl, _config.nick, _config.options);

		this.bot.addListener('message', (from, to, message) => {
			this.emit('message', from, to, message);
		});
	}

	output(data, e) {
		return new Promise((resolve, reject) => {
			console.ai(TAG, e);
			if (_.isString(e)) e = { text: e };

			if (e.error) return resolve();

			if (e.text) {
				this.bot.say(data.target, e.text);
				return resolve();
			}

			if (e.spotify) {
				if (e.spotify.song) {
					this.bot.say(data.target, e.spotify.song.external_urls.spotify);
					return resolve();
				}
				return reject();
			}

			return reject();
		});
	}
}

module.exports = IRC;
