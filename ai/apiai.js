const TAG = 'AI.APIAI';

class APIAI {
	constructor(opts) {
		this.client = require('apiai')(opts.token, {
			language: config.language || 'en'
		});
	}

	textRequest(data, text) {
		var self = this;

		return new Promise((resolve, reject) => {
			text = text.replace(AI_NAME_REGEX, '');

			let request = self.client.textRequest(text, data);
			console.debug(TAG, 'textRequest', text);

			request.on('response', (response) => {
				let result = response.result;
				console.debug(TAG, 'response', result);

				if (result.actionIncomplete === true) {

					console.debug(TAG, 'Action is incomplete');
					resolve({
						text: result.fulfillment.speech 
					});

				} else {

					if (_.isFunction(Actions[result.action])) {
						Actions[result.action]()(result, {
							data: data
						})
						.then(resolve)
						.catch(reject);
					} else if (result.fulfillment.speech) {
						resolve({ 
							text: result.fulfillment.speech 
						});
					} else {
						reject({ noStrategy: true });
					}

				}
			});

			request.on('error', (err) => {
				console.error(TAG, 'response error', err);
				reject(err);
			});

			request.end();
		});
	}
}

module.exports = APIAI;