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

    it(`should return the data with valid JSON schema ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            pair: publicCryptox.properties.instruments[0].pair,
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            done();
        });
    });

    it(`{type: 'trades', limit: 7} should return 7 buy/sell transactions ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            type: 'trades', limit: 7,
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            result.data.forEach(function (element, index, array) {
                let validType = ["sell","buy"].indexOf(element.type) >= 0;
                expect(validType).to.be.equal(true);
            });
            done();
        });
    });

    it(`{type: 'movements', limit: 3} should return 3 deposit/withdrawal transactions ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            type: 'movements', limit: 3,
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            result.data.forEach(function (element, index, array) {
                expect("deposit or withdrawal").to.have.string(element.type);
            });
            done();
        });
    });

    it(`{limit: 8} should return 8 transactions ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            limit: 8,
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            done();
        });
    });

    it(`{} should return the transactions with default 'limit' value ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(cryptox.properties.defaults.getTransactions.limit);
            done();
        });
    });

    it(`{skip: 2} should skip 2 transactions ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            skip: 2,
            limit: 3,
        };
        let skipTo = options.skip;
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            let skipToRecord = JSON.stringify(result.data[0]);
            delete options.skip;
            privateCryptox[method](options, function (err, resultNoSkip) {
                expect(resultNoSkip).to.be.jsonSchema(schema[method]);
                expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
                expect(result.data.length).to.be.equal(options.limit);
                done();
            });
        });
    });

    it(`{type: 'trades', skip: 6} should return trades and skip 6 ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            skip: 6,
			type: 'trades',
        };
        let skipTo = options.skip;
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            let skipToRecord = JSON.stringify(result.data[0]);
            delete options.skip;
            privateCryptox[method](options, function (err, resultNoSkip) {
                expect(resultNoSkip).to.be.jsonSchema(schema[method]);
                expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
                // expect(result.data.length).to.be.equal(options.limit);
                done();
            });
        });
    });

    it(`{type: 'movements', skip: 2} should return movements and skip 2 ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            skip: 2,
			type: 'trades',
        };
        let skipTo = options.skip;
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            let skipToRecord = JSON.stringify(result.data[0]);
            delete options.skip;
            cryptox[method](options, function (err, resultNoSkip) {
                expect(resultNoSkip).to.be.jsonSchema(schema[method]);
                expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
                done();
            });
        });
    });

    it(`{before: "2015-02-03 14:30", limit: 4} should return 4 transactions, before 2015-02-03 14:30 ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            before: "2015-02-03 14:30",
            limit: 4,
        };
        let mmt = moment (options.before);
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            result.data.forEach(function (element, index, array) {
                let valid = moment(element.datetime).isBefore(mmt) || moment(element.datetime).isSame(mmt);
                expect(valid).to.be.equal(true);
            });
            done();
        });
    });

    it(`{after: "2015-03-04"} should return transactions, after 2015-03-04 ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            after: "2015-02-04",
        };
        let mmt = moment (options.after);
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            result.data.forEach(function (element, index, array) {
                let valid = moment(element.datetime).isAfter(mmt) || moment(element.datetime).isSame(mmt);
                expect(valid).to.be.equal(true);
            });
            done();
        });
    });

    it(`{after: "2015-03-01", before: "2014-01-01"} should return an error ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            after: "2015-03-01",
            before: "2014-01-01",
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            done();
        });
    });

    it(`{type: 'movements', before: '2015-03-01', skip: 1, limit: 2} should return 2 movements before 2015-03-01 and skip 1 ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            type: 'movements',
            before: '2015-03-01',
            skip: 1,
            limit: 2,
        };
        let skipTo = options.skip;
        let mmt = moment (options.before);
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            result.data.forEach(function (element, index, array) {
                let validType = ["deposit","withdrawal"].indexOf(element.type) >= 0;
                expect(validType).to.be.equal(true);
            });
            result.data.forEach(function (element, index, array) {
                let valid = moment(element.datetime).isBefore(mmt) || moment(element.datetime).isSame(mmt);
                expect(valid).to.be.equal(true);
            });
            expect(result.data.length).to.be.equal(options.limit);
            let skipToRecord = JSON.stringify(result.data[0]);
            delete options.skip;
            privateCryptox[method](options, function (err, resultNoSkip) {
                expect(resultNoSkip).to.be.jsonSchema(schema[method]);
                expect(moment(resultNoSkip.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(skipToRecord).to.be.equal(JSON.stringify(resultNoSkip.data[skipTo]));
                done();
            });
        });
    });

    it(`should be able to return large results (possible with multiple successive API calls) ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            type: 'trades',
            limit: 3*10,
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            expect(result.data.length).to.be.equal(options.limit);
            let resultJSON = JSON.stringify(result.data);
            let max = cryptox.properties.dictionary.getTransactions.limit.maximum;
            privateCryptox.properties.dictionary.getTransactions.limit.maximum = options.limit / 3;
            privateCryptox[method](options, function (err, result2) {
                expect(result2).to.be.jsonSchema(schema[method]);
                expect(moment(result2.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(result.data.length).to.be.equal(options.limit);
                expect(resultJSON).to.be.equal(JSON.stringify(result2.data));
                cryptox.properties.dictionary.getTransactions.limit.maximum = max;
                done();
            });
        });
    });

    it(`{type: "movements", symbol: "XBT"} should return only XBT related movements ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            type: "movements",
			symbol: "XBT",
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            result.data.forEach(function (element, index, array) {
                let validType = ["deposit","withdrawal"].indexOf(element.type) >= 0;
                let s = validType ? "movements" : "not all";
                expect(s).to.be.equal("movements");
                validType = element.symbol.indexOf(options.symbol) >= 0;
                s = validType ? "symbol" : "not all include";
                expect(s).to.be.equal("symbol");
            });
            done();
        });
    });

    it(`{type: "movements", symbol: "BTC"} should return only XBT related movements ${skipMessage}`, function (done) {
        if (skipMessage !== '' && isMethodPrivate) return done();
        let options = {
            type: "movements",
            symbol: "BTC",
        };
        privateCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
            result.data.forEach(function (element, index, array) {
                let validType = ["deposit","withdrawal"].indexOf(element.type) >= 0;
                let s = validType ? "movements" : "not all";
                expect(s).to.be.equal("movements");
                validType = element.symbol.split('_').indexOf(options.symbol.replace(/xbt/i, "BTC")) >= 0;
                s = validType ? "symbol" : "not all include";
                expect(s).to.be.equal("symbol");
            });
            done();
        });
    });
};