"use strict";

var moment = require("moment");
var BITSTAMP = require('bitstamp');

var util = require("./util"); //custom functions

function Bitstamp (options) {
    var bitstampPublic, bitstampPrivate;
    var self = this;
    self["options"] = options;

    bitstampPublic = new BITSTAMP();
    if (typeof options["key"] === "string" && typeof options["secret"] === "string" && typeof options.username === "string") {
        bitstampPrivate = new BITSTAMP(options.key, options.secret, options.username);
    } else {
        bitstampPrivate = bitstampPublic;
    }

    self.getRate = function (options, callback) {
        self.getTicker(options, function(err, ticker) {
            var rate, data;
            rate = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if (err) {
                rate.error = err.message;
                return callback(err, rate);
            }
            rate.timestamp = ticker.timestamp;
            data = {
                pair: ticker.data[0].pair,
                rate: ticker.data[0].last
            };
            rate.data.push(data);
            callback(err, rate);
        });
    }

    self.getTicker = function (options, callback) {
        // https://www.bitstamp.net/api/ticker/
        var ticker, data;
        bitstampPublic.ticker(function(err, bitstampTicker) {
            if (err) {
                ticker = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                };
            } else {
                ticker = {
                    timestamp: util.timestamp(bitstampTicker.timestamp),
                    error: "",
                    data: []
                };
                data = {
                    pair: self.properties.instruments[0].pair,
                    last: parseFloat(bitstampTicker.last),
                    bid: parseFloat(bitstampTicker.bid),
                    ask: parseFloat(bitstampTicker.ask),
                    volume: parseFloat(bitstampTicker.volume),
                    high: parseFloat(bitstampTicker.high),
                    low: parseFloat(bitstampTicker.low),
                    vwap: parseFloat(bitstampTicker.vwap)
                };
                ticker.data.push(data);
            }
            callback(err, ticker);
        })
    }

    self.getOrderBook = function (options, callback) {
        var orderBook, data;
        bitstampPublic.order_book(function (err, bitstampOrderBook) {
            // https://www.bitstamp.net/api/order_book/
            var price, volume, order;
            if (err) {
                orderBook = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                };
            } else {
                orderBook = {
                    timestamp: util.timestamp(bitstampOrderBook.timestamp),
                    error: "",
                    data: []
                };
                data = {
                    pair: self.properties.instruments[0].pair,
                    asks: [],
                    bids: []
                };
                orderBook.data.push(data);
                bitstampOrderBook.asks.forEach(function (element, index, asks) {
                    price = parseFloat(asks[index][0]);
                    volume = parseFloat(asks[index][1]);
                    order = new Array(price, volume);
                    orderBook.data[0].asks.push(order);
                });
                bitstampOrderBook.bids.forEach(function (element, index, asks) {
                    price = parseFloat(asks[index][0]);
                    volume = parseFloat(asks[index][1]);
                    order = new Array(price, volume);
                    orderBook.data[0].bids.push(order);
                });
            }
            callback(err, orderBook);
        });
    }

    self.getTrades = function (options, callback) {
        var trades;
        var err = new Error("Method not implemented");
        trades = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, trades);
    }

    self.getFee = function (options, callback) {
        bitstampPrivate.balance(function(err, bitstampBalance) {
            var fee, data;
            fee = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if (err) {
                fee.error = err.message;
                return callback(err, fee);
            }
            data = {
                pair: "",
                maker_fee: parseFloat(bitstampBalance.fee) / 100, // note that Bitstamp native API call returns 0.2 for 0.2%
                taker_fee: parseFloat(bitstampBalance.fee) / 100
            };
            fee.data.push(data);
            callback(err, fee);
        });
    }

    self.getTransactions = function (options, callback) {
        var transactions;
        var err = new Error("Method not implemented");
        transactions = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, transactions);
    }

    self.getBalance = function (options, callback) {
        bitstampPrivate.balance(function(err, bitstampBalance) {
            var balance, data, amount;
            balance = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if (err) {
                balance.error = err.message;
                return callback(err, balance);
            }
            data = {
                balance: [],
                available: []
            };
            amount = parseFloat(bitstampBalance.btc_balance);
            if (amount)
                data.balance.push({currency: "XBT", amount: amount});
            amount = parseFloat(bitstampBalance.usd_balance);
            if (bitstampBalance.usd_balance)
                data.balance.push({currency: "USD", amount: amount});
            amount = parseFloat(bitstampBalance.btc_available);
            if (amount)
                data.available.push({currency: "XBT", amount: amount});
            amount = parseFloat(bitstampBalance.usd_available);
            if (amount)
                data.available.push({currency: "USD", amount: amount});
            balance.data.push(data);
            callback(err, balance);
        });
    }

    self.getOpenOrders = function (options, callback) {
        var openOrders;
        var err = new Error("Method not implemented");
        openOrders = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, openOrders);
    }

    self.postSellOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, orderResult);
    }

    self.postBuyOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, orderResult);
    }

    self.cancelOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, orderResult);
    }
}

Bitstamp.prototype.properties = {
    name: "Bitstamp",              // Proper name of the exchange/provider
    slug: "bitstamp",               // slug name of the exchange. Needs to be the same as the .js filename
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "XBTUSD"
        }
    ],
    publicAPI: {
        supported: true,            // is public API (not requireing user authentication) supported by this exchange?
        requires: []                // required parameters
    },
    privateAPI: {
        supported: true,            // is public API (requireing user authentication) supported by this exchange?
        requires: ["key", "secret", "username"]
    },
    marketOrder: false,             // does it support market orders?
    infinityOrder: false,           // does it supports infinity orders?
                                    // (which means that it will accept orders bigger then the current balance and order at the full balance instead)
    monitorError: "",               //if not able to monitor this exchange, please set it to an URL explaining the problem
    tradeError: "",                  //if not able to trade at this exchange, please set it to an URL explaining the problem
}

module.exports = Bitstamp;
