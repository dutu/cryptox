'use strict';

var Cryptox = require("../index.js");
var https = require("https");
var chai = require("chai");
var nock = require("nock");
var moment = require("moment");
var jf = require("jsonfile");

var config = require("./helpers/config.js");
var schema = require("./helpers/jsonSchemas.js");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var slug = "bitx";

var apiURL = {
    privateAPIhost: "https://btc-e.com",
    privatePath: {
        all: "/tapi"
    },
    publicAPIhost: "https://btc-e.com",
    publicPath: {
        depth: "/api/2/btc_usd/depth",
        fee: "/api/2/btc_usd/fee",
        ticker: "/api/2/btc_usd/ticker",
        trades: "/api/2/btc_usd/trades",
    }
};

describe("Integration Test " + slug + ":", function () {
    var nockServer, mockResponseFilename, options;
    var cryptox, publicCryptox, privateCryptox;
    var myKey, mySecret, apiKeys;
    try {       // load private keys (if exists)
        apiKeys = require("./helpers/private_keys.js");
        myKey = apiKeys[slug].key || "dummy";
        mySecret = apiKeys[slug].secret || "dummy";
    }
    catch (err) {
        myKey = mySecret = "dummy";
    }

    var returnError418 = function (method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
            expect(err.message).to.be.equal("418");
            expect(result.error).to.be.equal("418");
            done();
        });
    };

    var returnExpectedMock = function (method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.have.property("error").and.be.equal("");
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
            mockResponseFilename = __dirname + "/helpers/" + slug + "/" + slug + "-" + method + "_ExpectedMockResult.json";
            // jf.writeFileSync(mockResponseFilename, result);
            expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
            done();
        });
    };

    var returnValidSchema = function (method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
            done();
        });
    };

    var returnAuthorizationError = function (method, options, done) {
        publicCryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
            done();
        });
    };

    var returnAnError = function (method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
            done();
        });
    };


    describe("getRate", function () {
        before(function () {
            cryptox = new Cryptox(slug);
        });
        beforeEach(function () {
            nock.cleanAll();
        });
        it("should return specific error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .reply(418, "I'm a teapot");
            returnError418("getRate", {pair: "BTCUSD"}, done);
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .replyWithFile(200, __dirname + "/helpers/" + slug + "/" + "bitx-getRate_MockApiResponse-ticker.json");
            returnExpectedMock("getRate", {pair: "BTCUSD"}, done);
        });
        it("should return the rate with valid JSON schema", function (done) {
            returnValidSchema("getRate", {pair: "BTCUSD"}, done);
        });
    });

    describe("getTicker", function () {
        before(function () {
            cryptox = new Cryptox(slug);
        });
        beforeEach(function () {
            nock.cleanAll();
        });
        it("should return specific error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .reply(418, "I'm a teapot");
            returnError418("getTicker", {pair: "BTCUSD"}, done);
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .replyWithFile(200, __dirname + "/helpers/" + slug + "/" + "bitx-getTicker_MockApiResponse-ticker.json");
            returnExpectedMock("getTicker", {pair: "BTCUSD"}, done);
        });
        it("should return the ticker with valid JSON schema", function (done) {
            returnValidSchema("getTicker", {pair: "BTCUSD"}, done);
        });
    });

    describe("getOrderBook", function () {
        before(function () {
            cryptox = new Cryptox(slug);
        });
        beforeEach(function () {
            nock.cleanAll();
        });
        it("should return specific error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.depth)
                .reply(418, "I'm a teapot");
            returnError418("getOrderBook", {pair: "BTCUSD"}, done);
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.depth)
                .replyWithFile(200, __dirname + "/helpers/" + slug + "/" + "bitx-getOrderBook_MockApiResponse-depth.json");
            returnExpectedMock("getOrderBook", {pair: "BTCUSD"}, done);
        });
        it("should return the order book with valid JSON schema", function (done) {
            returnValidSchema("getOrderBook", {pair: "BTCUSD"}, done);
        });
    });

    describe("getFee", function () {
        before(function () {
            cryptox = new Cryptox(slug);
        });
        beforeEach(function () {
            nock.cleanAll();
        });
        it("should return specific error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.fee)
                .reply(418, "I'm a teapot");
            returnError418("getFee", {pair: "BTCUSD"}, done);
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.fee)
                .replyWithFile(200, __dirname + "/helpers/bitx/" + "bitx-getFee_MockApiResponse-fee.json");
            returnExpectedMock("getFee", {pair: "BTCUSD"}, done);
        });
        it("should return the fee with valid JSON schema", function (done) {
            returnValidSchema("getFee", {pair: "BTCUSD"}, done);
        });
    });

    describe("getOpenOrders", function () {
        before(function () {
            cryptox = new Cryptox(slug, {key: myKey, secret: mySecret});
            publicCryptox = new Cryptox(slug);
        });
        beforeEach(function () {
            nock.cleanAll();
        });
        it("should return specific error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .post(apiURL.privatePath.all, function (body) {
                    return body.method === "ActiveOrders"
                })
                .reply(418, "I'm a teapot");
            returnError418("getOpenOrders", {pair: "BTCUSD"}, done);
        });
        it("should return an authorization error with valid JSON schema", function (done) {
            returnAuthorizationError("getOpenOrders", {}, done);
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.privateAPIhost)
                .post(apiURL.privatePath.all, function (body) {
                    return body.method === "ActiveOrders"
                })
                .replyWithFile(200, __dirname + "/helpers/bitx/" + "bitx-getOpenOrders_MockApiResponse-activeorders.json");
            returnExpectedMock("getOpenOrders", {pair: "BTCUSD"}, done);
        });
        it("should return the open orders" +((myKey === "dummy") ? " <- skipped (API key is dummy)" : "") , function (done) {
            if (myKey === "dummy")
                done();
            else
                returnValidSchema("getOpenOrders", {pair: "BTCUSD"}, done);
        });
        it("should return API key error with valid JSON schema", function (done) {
            cryptox = new Cryptox(slug, {key: "dummy", secret: "dummy"});
            returnAnError("getOpenOrders", {pair: "BTCUSD"}, done);
        });
    });
});
