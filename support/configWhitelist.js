var _config = (config.support && config.support.configWhitelist) ? config.support.configWhitelist : {};

exports.isAllowed = function(id) {
	return _config.whitelist && _config.whitelist.indexOf(String(id)) >= 0;
}

