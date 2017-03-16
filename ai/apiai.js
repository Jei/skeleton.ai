const TAG = 'AI.APIAI';

class APIAI {
	constructor(opts) {
		this.bot = require('apiai')(opts.token, {
			language: public_config.language
		});
	}

	textRequest(data, text) {
		var self = this;

		return new Promise((resolve, reject) => {
			text = text.replace(new RegExp('(' + public_config.aiAliases.join('|') + ')'), '');

			_.defaults(data, {
				sessionId: Date.now()
			});

			let request = self.bot.textRequest(text, data);

			request.on('response', function(response) {
				let r = response.result;
				console.ai(TAG, 'response', r);

				if (_.isFunction(Actions[r.action])) {
					console.debug(TAG, `calling ${r.action}()`);

					Actions[r.action](r, io)
					.then(function(out) {
						console.debug(TAG, `result of ${r.action}()`, out);
						resolve(out);
					})
					.catch(function(err) {
						console.debug(TAG, `error in ${r.action}()`, err);
						reject(err);
					});

				} else if (r.fulfillment.speech) {
					console.ai(TAG, 'direct response', r.fulfillment.speech);
					resolve({ text: r.fulfillment.speech });
				} else {
					console.error(TAG, `No strategy found`);
					reject({ error: 'No strategy found' });
				}
			});

			request.on('error', (err) => {
				console.error(TAG, 'response error', err);
				reject({ error: 'Response error', exception: err });
			});

			request.end();
		});
	}
}

module.exports = APIAI;