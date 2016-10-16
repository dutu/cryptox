"use strict";

var moment = require("moment");

var util = require("./util"); //custom functions

function Oxr (options) {
    var oxrPrivate = require("open-exchange-rates");
    var self = this;
    self["options"] = options;

    self.getRate = function (options, callback) {
        var data, rate, err, curencyFrom, curencyTo;
        rate = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };

        if (typeof self.options.key === "string")
            oxrPrivate.set({ app_id: self.options.key });

        if (typeof options.pair !== "string") {
            err = new Error("Invalid currency pair");
            rate.error = err.message;
            return callback(err, rate);
        }
        curencyFrom = options.pair.substr(0,3);
        curencyTo = options.pair.substr(3,3);
        oxrPrivate.base = "USD";

        oxrPrivate.latest(function(err) {
            if (err) {
                rate.error = err.message;
                return callback(err, rate);
            }
            rate.timestamp = util.timestamp(oxrPrivate.timestamp);
            if (oxrPrivate.rates[curencyFrom] && oxrPrivate.rates[curencyTo]) {
                data = {
                    pair: curencyFrom + curencyTo,
                    rate: oxrPrivate.rates[curencyFrom] / oxrPrivate.rates[curencyTo]
                };
                rate.data.push(data);
                return callback(null, rate);
            }
            err = new Error("Invalid currency pair");
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
    tradeError: "https://openexchangerates.org/"   //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = Oxr;
