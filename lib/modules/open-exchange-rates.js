'use strict';

const httpAgent = require('http-agent');

function Oxr (app_id) {

	/* Library settings */

    // Module version:
    this.version = '0.3.1';

    // API base URL:
    this.api_url = 'http://openexchangerates.org/api/';

    // The default base currency ('USD'):
    this.base = 'USD';

    // The rates object:
    this.rates = {};

    // If something goes wrong, details will be stored in `oxr.error`:
    this.error = '';

    this.app_id = app_id || '';
}

	/* Library methods */

	// Sets API module parameters:
	// Currently only app_id is implemented (advanced parameters in roadmap)
Oxr.prototype.set = function(opts) {
	this.app_id = opts.app_id;
	return this;
};

// Loads `latest.json` (latest rates)
Oxr.prototype.latest = function(callback) {
	this.load('latest.json', callback);
	return this;
};

// Loads `historical/yyyy-mm-dd.json` (historical rates)
// `date` must be in format `'YYYY-MM-DD'`, e.g. `'2001-12-31'`
Oxr.prototype.historical = function(date, callback) {
	this.load('historical/' + date + '.json', callback);
	return this;
};

// The parse callback function takes the raw API data and parses/validates it.
Oxr.prototype.parse = function(data) {
    // Try to parse the data as JSON:
    try {
        data = JSON.parse(data);
    } catch(err) {
        this.error = 'Module error in parsing JSON data: ' + err.toString();
        return this;
    }

    // If the API returned an error message:
    if ( data && data.error ) {
        // Create debug message from API error:
        this.error = data.status + ' (' + data.message + '): ' + data.description;
        return this;
    }

    // The standard API response contains the base currency, an object of
    // exchange rates, and the timestamp of when the rates were published:
    if ( data && data.base && data.rates ) {
        this.base = data.base;
        this.rates = data.rates;
        this.timestamp = data.timestamp * 1000; // (unix to ms)
    } else {
        this.error = 'No rates or base currency returned from API';
    }

    return this;
};

// Loads exchange rates from the Open Exchange Rates API:
// `path` is optional (default `'latest.json'`)
// `callback` is required (see readme.md and example.js)
Oxr.prototype.load = function(path, callback) {
	// Default parameters:
	if (typeof path === 'function') callback = path;
	path = (typeof path === 'string') ? path : 'latest.json';

	// Build API URL
	const url = this.api_url + path + '?app_id=' + this.app_id;

	// Create the http-agent that will grab the data:
	let agent = httpAgent.create('', [{
		method: 'GET',
		uri: url
	}]);

	agent.addListener('next', function (err, agent) {
		this.error = err;
		if (!this.error && agent.response.statusCode !== 200) {
			this.error =  `Open-Exchange-Rates error ${agent.response.statusCode}: ${agent.response.statusMessage || ''} ${agent.body}`;
		}
		if (!this.error && typeof agent.body === 'undefined' || agent.body === null){
			this.error = 'Open-Exchange-Rates error: Empty response';
		}
		if (!this.error && agent.body.error) {
			this.error = agent.body.error;
		}

		let data = (agent && agent.body) ? agent.body : null;

        if (this.error) {
            return typeof callback === 'function' && callback(this.error, data);
        }

		// Parse the API response:
		// Try to parse the data as JSON:
		try {
			data = JSON.parse(data);
		} catch(err) {
			this.error = 'Module error in parsing JSON data: ' + err.toString();
            return typeof callback === 'function' && callback(this.error, data);
		}


		// If the API returned an error message:
		if (data && data.error ) {
			// Create debug message from API error:
			this.error = data.status + ' (' + data.message + '): ' + data.description;
			return typeof callback === 'function' && callback(this.error, data);
		}

		// The standard API response contains the base currency, an object of
		// exchange rates, and the timestamp of when the rates were published:
		if (data && data.base && data.rates ) {
			this.base = data.base;
			this.rates = data.rates;
			this.timestamp = data.timestamp * 1000; // (unix to ms)
		} else {
			this.error = 'No rates or base currency returned from API';
			return typeof callback === 'function' && callback(this.error, data);
		}

		// Fire callback function, passing in any error and the raw data:
        return typeof callback === 'function' && callback(this.error, data);
	});

	// Start http-agent:
	agent.start();
	return this;
};

module.exports = Oxr;
