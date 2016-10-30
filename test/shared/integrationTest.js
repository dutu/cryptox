'use strict';

const chai = require("chai");
const moment = require('moment');
const nock = require("nock");
const jf = require('jsonfile');
const fs = require('fs');
const _ = require('lodash');

let expect = chai.expect;
chai.use(require('chai-json-schema'));

const Cryptox = require('../../lib/index.js');
const schema = require('../helpers/jsonSchemas.js');

exports.integrationTest = function (contextIT) {
    const slug = contextIT.slug;
    let myApiKeys, apiKeysFromFile;
    try {                                                       // load private keys if exists, else set to "dummy"
        apiKeysFromFile = require('../helpers/private_keys.js');
        myApiKeys = {
            key: apiKeysFromFile[contextIT.slug].key || 'dummy',
            secret: apiKeysFromFile[contextIT.slug].secret || 'dummy',
            username: apiKeysFromFile[contextIT.slug].username || 'dummy',
        }
    }
    catch(err) {
        myApiKeys = {
            key: 'dummy',
            secret: 'dummy',
            username: 'dummy',
        }
    }

    let cryptox, apiHost;
    let publicCryptox = new Cryptox(contextIT.slug);
    let privateCryptox = new Cryptox(contextIT.slug, myApiKeys);

    function testNativeCall(args) {
        let nativeMethod = args[0];
        let nativeArgs = Array.prototype.slice(1);
        it(`should respond to '${nativeMethod}'`, function (done) {
            expect(privateCryptox.native).to.respondTo(nativeMethod);
            done();
        });
    }

    function shouldVerifyMockResults (method) {
        it("should return HTTP error 418 'I'm a teapot'", function (done) {
            let apiPath = "dummy/path/";
            let nockServerGet = nock(apiHost)
                .filteringPath(function (path) {
                    return apiPath;
                })
                .get(apiPath)
                .reply(418, "I'm a teapot");
            let nockServerPost = nock(apiHost)
                .filteringPath(function (path) {
                    return apiPath;
                })
                .post(apiPath)
                .reply(418, "I'm a teapot");
            cryptox[method](this.options, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                expect(err.message).to.contain("418");
                expect(result.error).to.contain("418");
                done();
            });
        });
        it("should return expected data", function (done) {
            let apiPath = "dummy/path/";
            let slug = cryptox.properties.slug;
            let helpersDirname = __dirname + "/../helpers/" + slug + "/";
            let mockResponseFilename = helpersDirname + slug + "-" + method + "_ExpectedMockResult.json";
            let replyFilename = helpersDirname + slug + "-" + method + "_MockApiResponse.json";
            let nockServerGet = nock(apiHost)
                .filteringPath(function(path) {
                    return apiPath;
                })
                .get(apiPath)
                .reply(200, function(uri, requestBody) {
                    let params = requestBody.split('&');
                    let command = null;
                    _.forEach(params, function (value) {
                        let param = value.split('=');
                        if (param[0].toLocaleLowerCase() === 'command') {
                            command = param[1];
                        }
                    });
                    if (command) replyFilename = `${helpersDirname}${slug}-${method}-${command}_MockApiResponse.json`;
                    return fs.createReadStream(replyFilename)
                });
            let nockServerPost = nock(apiHost)
                .filteringPath(function(path) {
                    return apiPath;
                })
                .post(apiPath)
                .times(3)
                .reply(200, function(uri, requestBody) {
                    let params = requestBody.split('&');
                    let command = null;
                    _.forEach(params, function (value) {
                       let param = value.split('=');
                       if (param[0].toLocaleLowerCase() === 'command') {
                           command = param[1];
                       }
                    });
                    if (command) replyFilename = `${helpersDirname}${slug}-${method}-${command}_MockApiResponse.json`;
                    return fs.createReadStream(replyFilename)
                });
            cryptox[method](this.options, function (err, result) {
                expect(err).to.be.equal(null);
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true);          // to be a valid ISO 8601 date
                if (contextIT.writeMockResponseFileForMethod === method)          // this option flag is only used for generating the mockResponseFile for the first time
                    jf.writeFileSync(mockResponseFilename, result, {spaces: 2});
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
    }

    function testMethod (private_public, method) {
        describe(method, function () {
            beforeEach(function () {
                if (private_public === "private") {
                    apiHost = contextIT.apiHost.private;
                    cryptox = privateCryptox;
                } else {
                    apiHost = contextIT.apiHost.public;
                    cryptox = publicCryptox;
                }
                switch (method) {           // set options
                    case "getFee":
                    case "getTicker":
                    case "getRate":
                    case "getOrderBook":
                    case "getTrades":
                        this.options = {
                            pair: publicCryptox.properties.instruments[0].pair
                        };
                        break;
                    case "getTransactions":
                        this.options = {
                            type: "trades",
	                        symbol: publicCryptox.properties.instruments[0].pair
                        };
                        break;
	                case "getLendBook":
		                this.options = {
			                currency: "USD"
		                };
		                break;
                    case "postSellOrder":
                        this.options = {
                            pair: publicCryptox.properties.instruments[0].pair,
                            rate: '0.03',
                            amount: '0.01',
                            margin: false,
                        };
                        break;
                    case "postBuyOrder":
                        this.options = {
                            pair: publicCryptox.properties.instruments[0].pair,
                            rate: '0.01',
                            amount: '0.01',
                            margin: false,
                        };
                        break;
                    case "getOpenOrders":
                        this.options = {
                            pair: "BTC_ETH",
                        };
                        break;
                    default:
                        this.options = {};
                }
                this.context = {                               //setting context. it will be used in mocha it statements in shouldVerifyParameters()
                    publicCryptox: publicCryptox,
                    cryptox: cryptox,                   // this is for public methods
                    method: this.test.parent.title,           // the describe title must be the method name
                    options: this.options
                };
                nock.cleanAll();
            });

            describe("Mock tests", function () {
                shouldVerifyMockResults(method);
            });
            describe("API tests", function () {
                before(function () {
                    nock.enableNetConnect();
                });
                let shared = require("./" + method + ".js");
                shared.shouldVerifyAPI(publicCryptox, privateCryptox);
            });
        });
    }

    contextIT.nativeCalls.forEach(function (nativeCall, index, array) {
        testNativeCall(nativeCall);
    });

    contextIT.publicMethodsToTest.forEach(function (method, index, array) {
        testMethod("public", method);
    });

    contextIT.privateMethodsToTest.forEach(function (method, index, array) {
        testMethod("private", method);
    });
};


