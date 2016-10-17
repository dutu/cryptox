"use strict";

const moment = require("moment");
const OXR = require('./modules/open-exchange-rates.js');

const util = require("./util"); //custom functions

function Oxr(options) {
    let self = this;
    let apiId = options && typeof options.key === "string" && options.key || "";
    let oxrPrivate = new OXR(apiId);
    self.options = options;

    self.getRate = function (options, callback) {
        let rate = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };


        if (typeof options.pair !== "string") {
            let err = new Error("Invalid currency pair");
            rate.error = err.message;
            return callback(err, rate);
        }

        let curencyFrom = options.pair.split('_')[0];
        let curencyTo = options.pair.split('_')[1];
        oxrPrivate.base = "USD";

        oxrPrivate.latest(function(error, result) {
            if (error) {
                let err = new Error(error);
                rate.error = err.message;
                return callback(err, rate);
            }

            // let jf = require("jsonfile").writeFileSync(__dirname + "/oxr-getRate_MockApiResponse.json", result, {spaces: 2});     // only used to create MockApiResponse file for the test unit

            rate.timestamp = util.timestamp(result.timestamp);
            if (result.rates[curencyFrom] && result.rates[curencyTo]) {
                let data = {
                    pair: options.pair,
                    rate: (result.rates[curencyTo] / result.rates[curencyFrom]).toFixed(8)
                };
                rate.data.push(data);
                return callback(null, rate);
            }

            let err = new Error("Invalid currency pair");
            rate.error = err.message;
            callback(err, rate);
        });
    };

}

Oxr.prototype.properties = {
    name: "Open Exchange Rate",              // Proper name of the exchange/provider
    slug: "oxr",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        implemented: ["getRate"],
        notSupported: ["getTicker", "getOrderBook", "getTrades", "getFee", "getTransactions",
            "getBalance", "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder", "getLendBook", "getActiveOffers", "postOffer", "cancelOffer", "getMarginPositions"]
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "EUR_USD"
        },
    ],
    publicAPI: {
        supported: false,            // is public API (not requireing user authentication) supported by this exchange?
        requires: []                // required parameters
    },
    privateAPI: {
        supported: true,            // is public API (requireing user authentication) supported by this exchange?
        requires: ["key"]
    },
    marketOrder: false,             // does it support market orders?
    infinityOrder: false,           // does it supports infinity orders?
                                    // (which means that it will accept orders bigger then the current balance and order at the full balance instead)
    monitorError: "",               //if not able to monitor this exchange, please set it to an URL explaining the problem
    tradeError: ""   //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = Oxr;
