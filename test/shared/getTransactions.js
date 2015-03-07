"use strict";

// See https://github.com/mochajs/mocha/wiki/Shared-Behaviours

var chai = require("chai");
var moment = require("moment");
var _ = require("lodash");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var schema = require("../helpers/jsonSchemas.js");

exports.shouldVerifyParameters = function() {
    it("{type: 'trades', limit: 7} should return 7 buy/sell transactions", function (done) {
        var options = {type: 'trades', limit: 7};
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            done();
        });
    });
    it("{type: 'movements', limit: 3} should return 3 deposit/withdrawal transactions", function (done) {
        var options = {type: 'movements', limit: 3};
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            done();
        });
    });
    it("{limit: 8} should return 8 transactions", function (done) {
        var options = {limit: 8};
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            done();
        });
    });
    it("{} should return the transactions with default 'limit' value", function (done) {
        var options = {};
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(cryptox.properties.defaults.getTransactions.limit);
            done();
        });
    });
    it("{skip: 2} should skip 2 transactions", function (done) {
        var options = {skip: 2, limit: 3};
        var skipTo = options.skip;
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            var skipToRecord = JSON.stringify(result.data[0]);
            cryptox[method]({}, function (err, resultNoSkip) {
                expect(resultNoSkip).to.be.jsonSchema(schema[method]);
                expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
                expect(result.data.length).to.be.equal(options.limit);
                done();
            });
        });
    });
    it('{before: "2015-02-03 14:30", limit 4} should return 4 transactions, before 2015-02-03 14:30', function (done) {
        var options = {before: "2015-02-03 14:30"};
	    var mmt, valid;
	    mmt = moment (options.before);
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            result.data.forEach(function (element, index, array) {
                valid = moment(element.datetime).isBefore(mmt) || moment(element.datetime).isSame(mmt);
                expect(valid).to.be.equal(true);
            });
            done();
        });
    });
    it('{after: "2015-03-04"} should return transactions, after 2015-03-04', function (done) {
        var options = {after: "2015-03-04"};
        var mmt, valid;
	    mmt = moment (options.after);
	    if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            result.data.forEach(function (element, index, array) {
                valid = moment(element.datetime).isAfter(mmt) || moment(element.datetime).isSame(mmt);
                expect(valid).to.be.equal(true);
            });
            done();
        });
    });
	it('{after: "2015-03-01", before: "2014-01-01"} should return an error', function (done) {
		var options = {after: "2015-03-01", before: "2014-01-01"};
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema.errorResult);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			done();
		});
	});
};