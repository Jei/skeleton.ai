const fs = require('fs');

fs.readdirSync(__dirname).forEach(function(file) {
	file = __dirname + '/' + file;

	const handler_name = file
	.replace('/index.js', '')
	.replace(__dirname + '/', '')
	.replace(/\//g, '.')
	.replace('.js','');

	if (config.handlers == null || handler_name == null || config.handlers[handler_name] == null) {
		return;
	}

	const stat = fs.lstatSync(file);
	if (stat.isFile() && /\.js$/.test(file)) {
		exports[handler_name] = function() {
			// TODO handle functions
			let Handler = require(file);

			return new Handler(config.handlers[handler_name]);
		};
	}
});
