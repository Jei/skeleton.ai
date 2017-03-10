const TAG = 'IO.IRC';
const _config = require('./config.json').telegram || {};
const IRCBot = require('irc');

class IRC extends require('./iodriver') {
	constructor() {
		super();
		this.bot = new IRC(_config.serverUrl, _config.nick, _config.options);

		// TODO ?

		this.bot.on('message', (e) => {
			this.emit('message', e);
		});
	}

	output(data, e) {
		return new Promise((resolve, reject) => {
			console.ai(TAG, e);

			// TODO message send logic
		});
	}
}

module.exports = IRC;
