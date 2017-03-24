const TAG = require('path').basename(__filename, '.js');
const MALAPPINFO = 'https://myanimelist.net/malappinfo.php';

// TODO create support module for localization
const i18n = require('i18n-nodejs')(config.language || 'en', require('fs').existsSync('../i18n/' + TAG + '.json') ? '../i18n/' + TAG + '.json' : '../i18n/default.json');

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
			let query = _.extend({
				u: this._config.defaultUser || ''
			}, result.parameters);

			this.malappinfo(query, (err, resp) => {
				require('xml2js').parseString(resp, function(err, result) {
					let malresult = result.myanimelist;

					if (malresult == null) return reject();

					if (malresult.myinfo == null) {
						return resolve({
							text: i18n.__("Sorry, I couldn't find any data for the user {{u}}", query)
						});
					}

					if (malresult.anime == null || malresult.manga == null) {
						return resolve({
							text: i18n.__("The user {{u}} has no {{type}} in his list yet.", query)
						});
					}

					return resolve({
						text: _.map(malresult[query.type || 'anime'], function(entry) {
							return entry.series_title + '\n';
						})
					});
				});
			});
		});
	}

	myList(result, data) {
		return this.list(result, _.extend(data, {
			u: this._config.defaultUser || ''
		}));
	}
}

module.exports = MyAnimeList;