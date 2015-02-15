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

var slug = "bitfinex";

var api = {
    private: {
        host: "https://api.bitfinex.com",
        path: {
            balances: "/v1/balances",
            open_orders: "/v1/open_orders/",
            user_transactions: "/v1/user_transactions/"
        },
    },
    public: {
        host: "https://api.bitfinex.com",
        path: {
            orderbook: "/v1/book",
            ticker: "/v1/pubticker",
            transactions: "/v1/transactions/",
            alltickers: "/v1/tickers"
        }
    },
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
            expect(err.message).to.contain("418");
            expect(result.error).to.contain("418");
            done();
        });
    };

    var returnExpectedMock = function (method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.have.property("error").and.be.equal("");
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
            mockResponseFilename = __dirname + "/helpers/" + slug + "/" + slug + "-" + method + "_ExpectedMockResult.json";
//              if (method === "getBalance")
//                 jf.writeFileSync(mockResponseFilename, result);
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
        var options;
        before(function () {
            cryptox = new Cryptox(slug);
        });
        beforeEach(function () {
            nock.cleanAll();
        });
        it("should return specific error with valid JSON schema", function (done) {
            options = {pair: "XBTUSD"};
            nockServer = nock(api.public.host)
                .get(api.public.path.ticker + "/" + options.pair.replace("XBT", "BTC").toLowerCase())
                .reply(418, "I'm a teapot");
            returnError418("getRate", options, done);
        });
        it("should return the rate with valid JSON schema", function (done) {
            options = {pair: "XBTUSD"};
            returnValidSchema("getRate", options, done);
        });
        it("should return expected mock result", function (done) {
            options = {pair: "XBTUSD"};
            nockServer = nock(api.public.host)
                .get(api.public.path.ticker + "/" + options.pair.replace("XBT", "BTC").toLowerCase())
                .replyWithFile(200, __dirname + "/helpers/" + slug + "/" + "bitfinex-getRate_MockApiResponse-ticker.json");
            returnExpectedMock("getRate", options, done);
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
            options = {pair: "XBTUSD"};
            nockServer = nock(api.public.host)
                .get(api.public.path.ticker + "/" + options.pair.replace("XBT", "BTC").toLowerCase())
                .reply(418, "I'm a teapot");
            returnError418("getTicker", options, done);
        });
        it("should return the ticker with valid JSON schema", function (done) {
            returnValidSchema("getTicker", {pair: "XBTUSD"}, done);
        });
        it("should return expected mock result", function (done) {
            options = {pair: "XBTUSD"};
            nockServer = nock(api.public.host)
                .get(api.public.path.ticker + "/" + options.pair.replace("XBT", "BTC").toLowerCase())
                .replyWithFile(200, __dirname + "/helpers/" + slug + "/" + "bitfinex-getTicker_MockApiResponse-ticker.json");
            returnExpectedMock("getTicker", options, done);
        });
        it("should return the ticker with valid JSON schema", function (done) {
            returnValidSchema("getTicker", options, done);
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
            options = {pair: "XBTUSD"};
            nockServer = nock(api.public.host)
                .filteringPath(function(path) {
                    return api.public.path.orderbook + "/" + options.pair.replace("XBT", "BTC").toLowerCase();
                })
                .get(api.public.path.orderbook + "/" + options.pair.replace("XBT", "BTC").toLowerCase())
                .reply(418, "I'm a teapot");
            returnError418("getOrderBook", options, done);
        });
        it("should return the order book with valid JSON schema", function (done) {
            returnValidSchema("getOrderBook", options, done);
        });
        it("should return expected mock result", function (done) {
            options = {pair: "XBTUSD"};
            nockServer = nock(api.public.host)
                .filteringPath(function(path) {
                    return api.public.path.orderbook + "/" + options.pair.replace("XBT", "BTC").toLowerCase();
                })
                .get(api.public.path.orderbook + "/" + options.pair.replace("XBT", "BTC").toLowerCase())
                .replyWithFile(200, __dirname + "/helpers/" + slug + "/" + "bitfinex-getOrderBook_MockApiResponse-book.json");
            returnExpectedMock("getOrderBook", options, done);
        });
    });

    describe("getBalance", function () {

        before(function() {
            cryptox = new Cryptox("bitfinex", {key: myKey, secret: mySecret});
            publicCryptox = new Cryptox(slug);

        });
        beforeEach(function () {
            nock.cleanAll();
        });
        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(api.private.host)
                .post(api.private.path.balances)
                .reply(418, "I'm a teapot");
            cryptox.getBalance({}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return an authorization error with valid JSON schema", function (done) {
            returnAuthorizationError("getBalance", {}, done);
        });
        it("should return the balance" +((myKey === "dummy") ? " <- skipped (API key is dummy)" : "") , function (done) {
            if (myKey === "dummy")
                done();
            else
                returnValidSchema("getBalance", {}, done);
        });
        it("should return expected mock result", function (done) {
            nockServer = nock(api.private.host)
                .post(api.private.path.balances)
                .replyWithFile(200, __dirname + "/helpers/bitfinex/" + "bitfinex-getBalance_MockApiResponse-balances.json");
            returnExpectedMock("getBalance", {}, done);
        });
        it("should return API key error with valid JSON schema", function (done) {
            cryptox = new Cryptox(slug, {key: "dummy", secret: "dummy"});
            returnAnError("getBalance", {}, done);
        });
    });
});
