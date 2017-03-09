class IODriver extends require('events') {
	constructor() {
		if (this.constructor === IODriver) {
			throw new TypeError('Can not construct abstract class.');
		}

		if (this.output === IODriver.prototype.output) {
			throw new TypeError('Please implement abstract method "output".');
		}
	}

	output() {
		throw new TypeError('Do not call abstract method "output" from child.');
	}
}

module.exports = IODriver;
