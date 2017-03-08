global.__basedir = __dirname;

global.config = require('./config.json');
global.public_config = require('./public_config.json');

global.AI_NAME_REGEX = /(otto|8:00)/;

[
[ 'warn',  '\x1b[35m' ],
[ 'error', '\x1b[31m' ],
[ 'info',   '\x1b[2m' ],
[ 'debug',   '\x1b[30m' ],
// Custom methods
[ 'user',   '\x1b[35m' ],
[ 'ai',   '\x1b[35m' ],
].forEach(function(pair) {
	var method = pair[0], reset = '\x1b[0m', color = '\x1b[36m' + pair[1];
	var func = console[method] || console.log;
	console[method] = function() {
		func.apply(console, [ color + '[' + method.toUpperCase() + ']' ].concat(_.toArray(arguments)).concat(reset) );
	};
});

global._ = require('underscore');

global.APIAI = require('./apiai');

// global.DB = require('mysql').createConnection(config.mysql);
// global.Memory = require('./memory');