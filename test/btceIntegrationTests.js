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

var cryptox, publicCryptox;

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

describe("Integration Test btce:", function () {
    var nockServer, mockResponseFilename;

    describe("getRate", function () {

        before(function() {
            cryptox = new Cryptox("btce");
        });

        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .replyWithFile(200, __dirname + "/helpers/btce/" + "btce-getRate_MockApiResponse-ticker.json");
            cryptox.getRate({pair: "BTCUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/btce/" + "btce-getRate_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .reply(418, "I'm a teapot");
            cryptox.getRate({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return the rate with valid JSON schema", function (done) {
            nock.cleanAll();
            cryptox.getRate({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.getRate);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });


    describe("getTicker", function () {

        before(function() {
            cryptox = new Cryptox("btce");
        });

        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .replyWithFile(200, __dirname + "/helpers/btce/" + "btce-getTicker_MockApiResponse-ticker.json");
            cryptox.getTicker({pair: "BTCUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/btce/" + "btce-getTicker_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.ticker)
                .reply(418, "I'm a teapot");
            cryptox.getTicker({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return the ticker with valid JSON schema", function (done) {
            nock.cleanAll();
            cryptox.getTicker({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.getTicker);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });


    describe("getOrderBook", function () {

        before(function() {
            cryptox = new Cryptox("btce");
        });

        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.depth)
                .replyWithFile(200, __dirname + "/helpers/btce/" + "btce-getOrderBook_MockApiResponse-depth.json");
            cryptox.getOrderBook({pair: "BTCUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/btce/" + "btce-getOrderBook_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.depth)
                .reply(418, "I'm a teapot");
            cryptox.getOrderBook({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return the order book with valid JSON schema", function (done) {
            nock.cleanAll();
            cryptox.getOrderBook({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.getOrderBook);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });


    describe("getFee", function () {

        before(function() {
            cryptox = new Cryptox("btce");
        });

        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.fee)
                .replyWithFile(200, __dirname + "/helpers/btce/" + "btce-getFee_MockApiResponse-fee.json");
            cryptox.getFee({pair: "BTCUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/btce/" + "btce-getFee_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.depth)
                .reply(418, "I'm a teapot");
            cryptox.getFee({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return the fee with valid JSON schema", function (done) {
            nock.cleanAll();
            cryptox.getFee({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.getFee);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
    });


    describe("getOpenOrders", function () {

        before(function() {
            cryptox = new Cryptox("btce", {key: "myKey", secret: "mySecret"});
            publicCryptox = new Cryptox("btce");
        });

        it("should return expected mock result", function (done) {
            nockServer = nock(apiURL.privateAPIhost)
                .post(apiURL.privatePath.all, function (body){
                    return body.method === "ActiveOrders"
                })
                .replyWithFile(200, __dirname + "/helpers/btce/" + "btce-getOpenOrders_MockApiResponse-activeorders.json");
            cryptox.getOpenOrders({pair: "BTCUSD"}, function (err, result) {
                expect(err).to.be.null;
                expect(result).to.have.property("error").and.be.equal("");
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
                mockResponseFilename = __dirname + "/helpers/btce/" + "btce-getOpenOrders_ExpectedMockResult.json";
                // jf.writeFileSync(mockResponseFilename, result);
                expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
                done();
            });
        });
        it("should return an error with valid JSON schema", function (done) {
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath.depth)
                .reply(418, "I'm a teapot");
            cryptox.getOpenOrders({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return invalid API key error with valid JSON schema", function (done) {
            nock.cleanAll();
            cryptox.getOpenOrders({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });
        it("should return authorization error with valid JSON schema", function (done) {
            nock.cleanAll();
            publicCryptox.getOpenOrders({pair: "BTCUSD"}, function (err, result) {
                expect(result).to.be.jsonSchema(schema.errorResult);
                expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
                done();
            });
        });

    });
});
