'use strict';

var Cryptox = require("../index.js");
var https = require("https");
var chai = require("chai");
var nock = require("nock");

var config = require("./helpers/config.js");

var expect = chai.expect;
var cryptox;



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



describe("btce", function () {
    var nockServer;
    var slug = "btce";

    describe("getOrderBook", function () {
        var xMethod = "depth";
        before(function() {
            cryptox = new Cryptox(slug);
            nockServer = nock(apiURL.publicAPIhost)
                .get(apiURL.publicPath[xMethod])
                .replyWithFile(200, __dirname + "/helpers/" + slug + "-" + xMethod + "_FakeResponse.json");
        });

        it('should return the orderbook', function () {
            cryptox.getOrderBook({pair: "BTCUSD"}, function (err, result) {
                expect(err).to.null;
            });
        });
    });
});
