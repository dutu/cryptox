"use strict";

var chai = require("chai");
var moment = require("moment");
var nock = require("nock");
var jf = require("jsonfile");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var Cryptox = require("../../index.js");
var schema = require("../helpers/jsonSchemas.js");

exports.integrationTest = function (contextIT) {
    var slug = contextIT.slug;
    var myApiKeys, apiKeysFromFile;
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

    var dummyApiKeys = myApiKeys.key === "dummy";
    var cryptox, apiHost;
    var publicCryptox = new Cryptox(contextIT.slug);
    var privateCryptox = new Cryptox(contextIT.slug, myApiKeys);

    function shouldVerifyMockResults (method) {
        it("should return HTTP error 418 'I'm a teapot'", function (done) {
            var apiPath = "dummy/path/";
            var nockServerGet = nock(apiHost)
                .filteringPath(function (path) {
                    return apiPath;
                })
                .get(apiPath)
                .reply(418, "I'm a teapot");
            var nockServerPost = nock(apiHost)
                .filteringPath(function (path) {
                    return apiPath;
                })
                .post(apiPath)
                .reply(418, "I'm a teapot");
            cryptox[method](this.options, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                expect(err.message).to.contain("418");
                expect(result.error).to.contain("418");
                done();
            });
        });
        it("should return expected data", function (done) {
            var apiPath = "dummy/path/";
            var slug = cryptox.properties.slug;
            var helpersDirname = __dirname + "/../helpers/" + slug + "/";
            var mockResponseFilename = helpersDirname + slug + "-" + method + "_ExpectedMockResult.json";
            var replyFilename        = helpersDirname + slug + "-" + method + "_MockApiResponse.json";
            var nockServerGet = nock(apiHost)
                .filteringPath(function(path) {
                    return apiPath;
                })
                .get(apiPath)
                .replyWithFile(200, replyFilename);
            var nockServerPost = nock(apiHost)
                .filteringPath(function(path) {
                    return apiPath;
                })
                .post(apiPath)
                .replyWithFile(200, replyFilename);
            cryptox[method](this.options, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                if (contextIT.writeMockResponseFileForMethod === method)          // this option flag is only used for generating the mockResponseFile for the first time
                    jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
    }

    function shouldReturnValidJSONSchema (method) {
        it("should return the data with valid JSON schema" + (dummyApiKeys ? " <-- Skipped due to 'dummy' API key)" : ""), function (done) {
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
            var options = {};
            publicCryptox[method](options, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
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
                var shared = require("./" + method + ".js");
                shared.shouldVerifyParameters();
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


