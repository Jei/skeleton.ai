require('./boot');

_.each(config.aiDrivers, (opts, driver_name) => {
	let Driver = require(__basedir + '/ai/' + driver_name);
	AIs[driver_name] = new Driver(opts);
	console.info('Created AI driver "' + driver_name + '"');
});

_.each(config.ioDrivers, (opts, driver_name) => {
	let Driver = require(__basedir + '/io/' + driver_name);
	IOs[driver_name] = new Driver(opts);
	console.info('Created IO driver "' + driver_name + '"');
});

Handlers = require(__basedir + '/handlers');

_.each(config.behaviors, (opts, behavior_name) => {
	// TODO find the right way to pass parameters to the behaviors
	Behaviors[behavior_name] = require(__basedir + '/behaviors/' + behavior_name);
	console.info('Added behavior "' + behavior_name + '"');
});
