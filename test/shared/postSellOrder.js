'use strict';

// See https://github.com/mochajs/mocha/wiki/Shared-Behaviours

const chai = require('chai');
const moment = require('moment');
const _ = require('lodash');

const expect = chai.expect;
chai.use(require('chai-json-schema'));

const schema = require('../helpers/jsonSchemas.js');

exports.shouldVerifyParameters = function() {
	it('Should post the order', function (done) {
	    let validType;
        if (this.skipParamTests) return done();
        let cryptox = this.context.cryptox;
        let method = this.context.method;
        let options = {pair: cryptox.properties.instruments[0].pair};

        cryptox.getRate(options, function(err, result) {
            options.rate = (parseFloat(result.data[0].rate)*1.15).toFixed(8);
            options.amount = '0.05';
            cryptox[method](options, function (err, result) {
                expect(result).to.be.jsonSchema(schema[method]);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(result.data.length).to.be.equal(1);
                expect(typeof result.data[0].order_id).to.be.equal('string');
                done();
            });
        });
    });
    it('Should post margin order', function (done) {
        let validType;
        if (this.skipParamTests) return done();
        let cryptox = this.context.cryptox;
        let method = this.context.method;
        let options = {pair: cryptox.properties.instruments[0].pair};

        cryptox.getRate(options, function(err, result) {
            options.rate = (parseFloat(result.data[0].rate)*1.15).toFixed(8);
            options.amount = '0.05';
            options.margin = true;
            cryptox[method](options, function (err, result) {
                expect(result).to.be.jsonSchema(schema[method]);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(result.data.length).to.be.equal(1);
                expect(typeof result.data[0].order_id).to.be.equal('string');
                done();
            });
        });
    });
	it('{} should return an error)', function (done) {
		let options = {};
		let cryptox = this.context.cryptox;
		let method = this.context.method;
		cryptox[method](options, function (err, result) {
			expect(result).to.be.jsonSchema(schema.errorResult);
			expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
			done();
		});
	});
};
