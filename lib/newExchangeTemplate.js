"use strict";

var moment = require("moment");

var util = require("./util"); //custom functions

function NewExchangeTemplate (options) {
    var self = this;
    self[options] = options;

    self.getTicker = function (options, callback) {
        var ticker;
        var err = new Error("Method not implemented")
        ticker = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, ticker);
    }

    self.getOrderBook = function (options, callback) {
        var orderBook;
        var err = new Error("Method not implemented")
        orderBook = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, orderBook);
    }

    self.getTrades = function (options, callback) {
        var trades;
        var err = new Error("Method not implemented")
        trades = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, trades);
    }

    self.getFee = function (options, callback) {
        var fee;
        var err = new Error("Method not implemented")
        fee = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, fee);
    }

    self.getTransactions = function (options, callback) {
        var transactions;
        var err = new Error("Method not implemented")
        transactions = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, transactions);
    }

    self.getBalance = function (options, callback) {
        var balance;
        var err = new Error("Method not implemented")
        balance = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, balance);
    }

    self.getOpenOrders = function (options, callback) {
        var openOrders;
        var err = new Error("Method not implemented")
        openOrders = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, openOrders);
    }

    self.postSellOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, orderResult);
    }

    self.postBuyOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, orderResult);
    }

    self.cancelOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: moment().utc().format("X"),
            error: err.message,
            data: {}
        }
        callback(err, orderResult);
    }
}

Btce.prototype.properties = {
    name: "Template for new exchange",              // Proper name of the exchange/provider
    slug: "newExchangeTemplate",               // slug name of the exchange. Needs to be the same as the .js filename
    markets: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "USDBTC"
        },
        {
            pair: "RURBTC"
        },
        {
            pair: "EURBTC"
        },
        {
            pair: "BTCLTC"
        },
        {
            pair: "USDLTC"
        },
        {
            pair: "RURLTC"
        },
        {
            pair: "EURLTC"
        },
        {
            pair: "BTCNMC"
        },
        {
            pair: "USDNMC"
        },
        {
            pair: "BTCNVC"
        },
        {
            pair: "USDNVC"
        },
        {
            pair: "RURUSD"
        },
        {
            pair: "USDEUR"
        },
        {
            pair: "BTCTRC"
        },
        {
            pair: "BTCPPC"
        },
        {
            pair: "USDPPC"
        },
        {
            pair: "BTCFTC"
        },
        {
            pair: "BTCXPM"
        }
    ],
    publicAPI: {
        supported: true,            // is public API (not requireing user authentication) supported by this exchange?
        requires: []                // required parameters
    },
    privateAPI: {
        supported: true,            // is public API (requireing user authentication) supported by this exchange?
        requires: ["key", "secret"]
    },
    marketOrder: false,             // does it support market orders?
    infinityOrder: false,           // does it supports infinity orders?
                                    // (which means that it will accept orders bigger then the current balance and order at the full balance instead)
    monitorError: "",               //if not able to monitor this exchange, please set it to an URL explaining the problem
    tradeError: "",                  //if not able to trade at this exchange, please set it to an URL explaining the problem
    fee: 0.002                      // fee is hardcoded and fixed to 0.2%
}

module.exports = NewExchangeTemplate;
