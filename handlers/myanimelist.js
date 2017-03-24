const TAG = require('path').basename(__filename, '.js');
const MALAPPINFO = 'https://myanimelist.net/malappinfo.php';

class MyAnimeList {
	constructor(cfg) {
		this._config = cfg;
		this.malappinfo = function(opt, callback) {
			let request = require('request');

			request({
				url: MALAPPINFO + '?' + require('querystring').stringify(opt),
				gzip: true
			}, function(error, response, body) {
				if (callback) callback(error, body);
			});
		};
	}

	list(result, data) {
		return new Promise((resolve, reject) => {
			_.defaults(data, {
				u: this._config.defaultUser || ''
			});

			this.malappinfo(data, (err, resp) => {
				require('xml2js').parseString(resp, function(err, result) {
					console.log(result);
					// TODO handle empty list

					if (result.myanimelist == null) return reject();

					return reject();
				});
			});
		});
	}
}

module.exports = MyAnimeList;