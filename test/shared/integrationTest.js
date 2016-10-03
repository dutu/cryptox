"use strict";

const chai = require("chai");
const moment = require("moment");
const nock = require("nock");
const jf = require("jsonfile");
const fs = require('fs');
const _ = require('lodash');

let expect = chai.expect;
chai.use(require("chai-json-schema"));

const Cryptox = require("../../index.js");
const schema = require("../helpers/jsonSchemas.js");

exports.integrationTest = function (contextIT) {
    const slug = contextIT.slug;
    let myApiKeys, apiKeysFromFile;
    try {                                                       // load private keys if exists, else set to "dummy"
        apiKeysFromFile = require("../helpers/private_keys.js");
        myApiKeys = {
            key: apiKeysFromFile[contextIT.slug].key || "dummy",
            secret: apiKeysFromFile[contextIT.slug].secret || "dummy",
            username: apiKeysFromFile[contextIT.slug].username || "dummy"
        }
    }
    catch(err) {
        myApiKeys = {
            key: "dummy",
            secret: "dummy",
            username: "dummy"
        }
    }

    let dummyApiKeys = myApiKeys.key === "dummy";
    let cryptox, apiHost;
    let publicCryptox = new Cryptox(contextIT.slug);
    let privateCryptox = new Cryptox(contextIT.slug, myApiKeys);

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

    function shouldReturnValidJSONSchema (method) {
        it("should return the data with valid JSON schema" + (dummyApiKeys ? " <-- Skipped; no API keys in '/test/helpers/private_key.js" : ""), function (done) {
            if (!this.options)
                this.options = {};
            if (dummyApiKeys) {
                return done();
            }
            cryptox[method](this.options, function (err, result) {
                expect(result).to.be.jsonSchema(schema[method]);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
                done();
            });
        });
    }

    function shouldReturnAuthorizationError (method) {
        it("should return error when no authorization", function (done) {
            let options = {};
            publicCryptox[method](options, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.equal(true); // to be a valid ISO 8601 date
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
                    this.skipPrivateMethodTest = dummyApiKeys;
                } else {
                    apiHost = contextIT.apiHost.public;
                    cryptox = publicCryptox;
                    this.skipPrivateMethodTest = false;
                }
                switch (method) {           // set options
                    case "getTicker":
                    case "getRate":
                    case "getOrderBook":
                        this.options = {
                            pair: privateCryptox.properties.instruments[0].pair
                        };
                        break;
                    case "getTransactions":
                        this.options = {
                            type: "trades",
	                        symbol: privateCryptox.properties.instruments[0].pair
                        };
                        break;
	                case "getLendBook":
		                this.options = {
			                currency: "USD"
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
                shouldReturnValidJSONSchema(method);
                if (private_public === "private") {
                    shouldReturnAuthorizationError(method);
                }
            });
            describe("Parameter tests", function () {
                before(function () {
                    nock.enableNetConnect();
                });
                let shared = require("./" + method + ".js");
                if (!dummyApiKeys) {
                    shared.shouldVerifyParameters();
                }
            });

        });
    }

    contextIT.publicMethodsToTest.forEach(function (method, index, array) {
        testMethod( "public", method);
    });

    contextIT.privateMethodsToTest.forEach(function (method, index, array) {
        testMethod("private", method);
    });
};


