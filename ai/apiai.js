const TAG = 'AI.APIAI';

function getActionMethod(str) {
	let dot_pos = str.indexOf('.');

	if (dot_pos) {
		let handler_name = str.slice(0, dot_pos);
		let method = str.slice(dot_pos + 1).toLowerCase().replace(/\.(.)/g, function(match, group1) {
			return group1.toUpperCase();
		});

		if (method == null || !_.isFunction(Handlers[handler_name])) return null;

		let Handler = Handlers[handler_name]();

		return Handler[method].bind(Handler);
	} else if (_.isFunction(Handlers[str])) {
		// TODO check if action is class?
		return Handlers[str];
	} else {
		return null;
	}
}

class APIAI {
	constructor(opts) {
		this.client = require('apiai')(opts.token, {
			language: config.language || 'en'
		});
	}

	textRequest(data, text) {
		let self = this;

		return new Promise((resolve, reject) => {
			console.debug(TAG, 'textRequest', text);
			let request = self.client.textRequest(text, data);

			request.on('response', (response) => {
				let result = response.result;
				let fulfillment = result.fulfillment;
				let action = getActionMethod(result.action);
				console.debug(TAG, 'response', JSON.stringify(result, null, 2));

				if (result.actionIncomplete === false && action != null) {
					return action(result, data)
						.then(resolve)
						.catch(reject);
				}

				if (!_.isEmpty(fulfillment.speech)) {
					return resolve({
						text: fulfillment.speech
					});
				}

				if (fulfillment.messages.length > 0) {
					let msg = fulfillment.messages[Math.floor(Math.random() * fulfillment.messages.length)];
					if (msg.replies) {
						return resolve({
							text: fulfillment.messages[0].title,
							replies: fulfillment.messages[0].replies
						});
					} else if (msg.imageUrl){
						return resolve({
							image: {
								remoteFile: msg.imageUrl
							}
						});
					}
				}

				reject({ noStrategy: true });
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
