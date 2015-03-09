"use strict";

// See https://github.com/mochajs/mocha/wiki/Shared-Behaviours

var chai = require("chai");
var moment = require("moment");
var _ = require("lodash");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var schema = require("../helpers/jsonSchemas.js");

exports.shouldVerifyParameters = function() {
	it('{type: "movements", symbol: "XBT"} should return only XBT related movements', function (done) {
		var options = {type: "movements", symbol: "XBT"};
		var mmt, valid;
		mmt = moment (options.after);
		if (this.skipParamTests) return done();
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema[method]);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			result.data.forEach(function (element, index, array) {
				var validType = ["deposit","withdrawal"].indexOf(element.type) >= 0;
				var s = validType ? "movements" : "not all";
				expect(s).to.be.equal("movements");
				validType = element.symbol.indexOf(options.symbol) >= 0;
				s = validType ? "symbol" : "not all include";
				expect(s).to.be.equal("symbol");
			});
			done();
		});
	});
	it("{type: 'trades', limit: 7} should return 7 buy/sell transactions", function (done) {
        var options = {type: 'trades', limit: 7};
	    var validType;
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
	        result.data.forEach(function (element, index, array) {
		        validType = ["sell","buy"].indexOf(element.type) >= 0;
		        expect(validType).to.be.equal(true);
	        });
            done();
        });
    });
    it("{type: 'movements', limit: 3} should return 3 deposit/withdrawal transactions", function (done) {
        var options = {type: 'movements', limit: 3};
	    var validType;
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
	        result.data.forEach(function (element, index, array) {
		        validType = ["deposit","withdrawal"].indexOf(element.type) >= 0;
		        expect(validType).to.be.equal(true);
	        });
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
	        delete options.skip;
            cryptox[method](options, function (err, resultNoSkip) {
                expect(resultNoSkip).to.be.jsonSchema(schema[method]);
                expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
                expect(result.data.length).to.be.equal(options.limit);
                done();
            });
        });
    });
	it("{type: 'trades', skip: 23} should return trades and skip 23", function (done) {
		var options = {skip: 23, type: 'trades'};
		var skipTo = options.skip;
		if (this.skipParamTests) return done();
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema[method]);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			var skipToRecord = JSON.stringify(result.data[0]);
			delete options.skip;
			cryptox[method](options, function (err, resultNoSkip) {
				expect(resultNoSkip).to.be.jsonSchema(schema[method]);
				expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
				expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
				expect(result.data.length).to.be.equal(options.limit);
				done();
			});
		});
	});
	it("{type: 'movements', skip: 3} should return movements and skip 3", function (done) {
		var options = {skip: 23, type: 'trades'};
		var skipTo = options.skip;
		if (this.skipParamTests) return done();
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema[method]);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			var skipToRecord = JSON.stringify(result.data[0]);
			delete options.skip;
			cryptox[method](options, function (err, resultNoSkip) {
				expect(resultNoSkip).to.be.jsonSchema(schema[method]);
				expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
				expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
				done();
			});
		});
	});
    it('{before: "2015-02-03 14:30", limit 4} should return 4 transactions, before 2015-02-03 14:30', function (done) {
        var options = {before: "2015-02-03 14:30"};
	    var mmt;
	    mmt = moment (options.before);
        if (this.skipParamTests) return done();
        var cryptox = this.context.cryptox;
        var method = this.context.method;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            result.data.forEach(function (element, index, array) {
                var valid = moment(element.datetime).isBefore(mmt) || moment(element.datetime).isSame(mmt);
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
	it("{type: 'movements', before: '2015-01-01', skip: 2, limit = 3} should return 3 movements before 2015-01-01 and skip 2", function (done) {
		var options = {type: 'movements', before: '2015-01-01', skip: 2, limit: 3};
		var skipTo = options.skip;
		var mmt = moment (options.before);
		if (this.skipParamTests) return done();
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema[method]);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			result.data.forEach(function (element, index, array) {
				var validType = ["deposit","withdrawal"].indexOf(element.type) >= 0;
				expect(validType).to.be.equal(true);
			});
			result.data.forEach(function (element, index, array) {
				var valid = moment(element.datetime).isBefore(mmt) || moment(element.datetime).isSame(mmt);
				expect(valid).to.be.equal(true);
			});
			expect(result.data.length).to.be.equal(options.limit);
			var skipToRecord = JSON.stringify(result.data[0]);
			delete options.skip;
			cryptox[method](options, function (err, resultNoSkip) {
				expect(resultNoSkip).to.be.jsonSchema(schema[method]);
				expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
				expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
				done();
			});
		});
	});
	it("should be able to accumulate result from 3 successive API calls", function (done) {
		var options = {type: 'trades', limit: 3*10};
		var max;
		if (this.skipParamTests) return done();
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema[method]);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			expect(result.data.length).to.be.equal(options.limit);
			var resultJSON = JSON.stringify(result.data);
			max = cryptox.properties.dictionary.user_transactions.limit.maximum;
			cryptox.properties.dictionary.user_transactions.limit.maximum = options.limit / 3;
			cryptox[method](options, function (err, result2) {
				expect(result2).to.be.jsonSchema(schema[method]);
				expect(moment(result2.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
				expect(result.data.length).to.be.equal(options.limit);
				expect(resultJSON).to.be.equal(JSON.stringify(result2.data));
				cryptox.properties.dictionary.user_transactions.limit.maximum = max;
				done();
			});
		});
	});
	it('{symbol: "ABC"} should return an error (not supported by the exchange)', function (done) {
		var options = {symbol: "XXL"};
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema.errorResult);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			done();
		});
	});
	it('{symbol: "XBTABC"} should return an error (not supported by the exchange)', function (done) {
		var options = {symbol: "XXL"};
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema.errorResult);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			done();
		});
	});
	it('{symbol: "XBTUS"} should return an error (not supported by the exchange)', function (done) {
		var options = {symbol: "XXL"};
		var cryptox = this.context.cryptox;
		var method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema.errorResult);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			done();
		});
	});
};