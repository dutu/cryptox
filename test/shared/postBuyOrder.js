'use strict';

const _ = require('lodash');
const moment = require('moment');
const path = require('path');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('chai-json-schema'));

const schema = require('../helpers/jsonSchemas.js');
const method = path.basename(__filename).split('.')[0];
const isMethodPrivate = true;

exports.shouldVerifyAPI = function(publicCryptox, privateCryptox) {
    let skipMessage = isMethodPrivate && privateCryptox.options.key === 'dummy' && "<-- Skipped; pls set API keys in '/test/helpers/private_key.js" || '';
    let cryptox = privateCryptox;

    it("should return error when no authorization", function (done) {
        let options = {};
        publicCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            done();
        });
    });

    it(`should post order ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            pair: publicCryptox.properties.instruments[0].pair
        };

        cryptox.getRate(options, function(err, result) {
            options.rate = (parseFloat(result.data[0].rate)*0.85).toFixed(8);
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

    it(`should post margin order ${skipMessage}`, function (done) {
        let options = {
        };
        if (skipMessage !== '' && isMethodPrivate) return done();
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            done();
        });
    });

};
