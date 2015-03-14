"use strict";

// See https://github.com/mochajs/mocha/wiki/Shared-Behaviours

var chai = require("chai");
var moment = require("moment");
var _ = require("lodash");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var schema = require("../helpers/jsonSchemas.js");

exports.shouldVerifyParameters = function() {
	it('{currency: 3} should return an error', function (done) {
		var options = {currency: 3};
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema.errorResult);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			done();
		});
	});
	it('{} should return an error', function (done) {
		var options = {};
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema.errorResult);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			done();
		});
	});
};
