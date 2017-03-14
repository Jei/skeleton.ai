require('./boot');

config.aiDrivers.forEach((driver_name) => {
	let Driver = require(__basedir + '/ai/' + driver_name);
	AIs[driver_name] = new Driver();
	console.info('Created AI driver "' + driver_name + '"');
});

config.ioDrivers.forEach((driver_name) => {
	let Driver = require(__basedir + '/io/' + driver_name);
	IOs[driver_name] = new Driver();
	console.info('Created IO driver "' + driver_name + '"');
});

config.behaviors.forEach((behavior_name) => {
	Behaviors[behavior_name] = require(__basedir + '/behaviors/' + behavior_name);
	console.info('Added behavior "' + behavior_name + '"');
});

config.actions.forEach((action_name) => {
	Actions[action_name] = require(__basedir + '/actions/' + action_name);
	console.info('Added action "' + action_name + '"');
});
