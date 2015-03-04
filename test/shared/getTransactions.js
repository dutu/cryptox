"use strict";

// See https://github.com/mochajs/mocha/wiki/Shared-Behaviours

var chai = require("chai");
var moment = require("moment");
var _ = require("lodash");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var schema = require("../helpers/jsonSchemas.js");

exports.shouldVerifyParameters = function() {
    it("{limit: 2} should return 2 transactions", function (done) {
        var options = {limit: 2};
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
        var options = {skip: 2};
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
                done();
            });
        });
    });
};