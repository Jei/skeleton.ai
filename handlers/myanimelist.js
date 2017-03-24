const TAG = require('path').basename(__filename, '.js');

// MALAPPINFO constants
const MALAPPINFO = 'https://myanimelist.net/malappinfo.php';
const MALAPPINFO_SUPPORTED_PARAMS = ['u','type'];

// TODO create support module for localization
const i18n = require('i18n-nodejs')(config.language || 'en', require('fs').existsSync('../../i18n/' + TAG + '.json') ? '../../i18n/' + TAG + '.json' : '../../i18n/default.json');

function formatResults(list, filters) {
	return _.map(_.where(list, filters), function(entry) {
		return entry.series_title;
	}).join('\n');
}

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
				type: 'anime'
			}, result.parameters);

			if (query.u == null) {
				return resolve({
					text: i18n.__("I don't have a username to search.")
				});
			}

			this.malappinfo(_.pick(query, MALAPPINFO_SUPPORTED_PARAMS), (err, resp) => {
				require('xml2js').parseString(resp, function(err, result) {
					let malresult = result.myanimelist;

					if (malresult == null) return reject();

					if (malresult.myinfo == null) {
						return resolve({
							text: i18n.__("Sorry, I couldn't find any data for the user {{u}}.", query)
						});
					}

					if (malresult.anime == null && malresult.manga == null) {
						return resolve({
							text: i18n.__("The user {{u}} has no {{type}} in his list yet.", query)
						});
					}

					return resolve({
						text: filterResults(malresult[query.type || 'anime'], _.omit(query, MALAPPINFO_SUPPORTED_PARAMS))
					});
				});
			});
		});
	}

	myList(result, data) {
		result.parameters.u = this._config.defaultUser;

		return this.list(result, data);
	}
}

module.exports = MyAnimeList;