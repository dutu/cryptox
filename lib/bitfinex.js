"use strict";

var moment = require("moment");
var _ = require("lodash");
var BITFINEX = require('bitfinex');

var util = require("./util"); //custom functions

function Bitfinex (options) {
    var bitfinexPublic, bitfinexPrivate;
    var self = this;
    self["options"] = options;

    bitfinexPublic = new BITFINEX();
    if (typeof options.key === "string" && typeof options.secret === "string")
        bitfinexPrivate = new BITFINEX(options.key, options.secret);
    else
        bitfinexPrivate = bitfinexPublic;


    self.getRate = function (options, callback) {
        getOneTicker(options, function(err, ticker) {
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
            callback(null, rate);
        });
    }

    var getOneTicker = function (options, callback) {
        var ticker, data, symbol;
        ticker = {
            timestamp: util.timestampNow(),
            error:"",
            data: []
        };
        symbol = typeof options.pair === "string" && options.pair.replace("XBT", "BTC").toLowerCase() || "";
        bitfinexPublic.ticker(symbol, function(err, bitfinexTicker) {
            if (err) {
                ticker.error = err.message === "404" ? "Invalid currency pair" : err.message;
                return callback(err, ticker);
            }
            data = {
                pair: options.pair,
                last: parseFloat(bitfinexTicker.last_price),
                bid: parseFloat(bitfinexTicker.bid),
                ask: parseFloat(bitfinexTicker.ask),
                volume: parseFloat(bitfinexTicker.volume),
                high: parseFloat(bitfinexTicker.high),
                low: parseFloat(bitfinexTicker.low),
            };
            ticker.timestamp = util.timestamp(bitfinexTicker.timestamp);
            ticker.data.push(data);
            callback(null, ticker);
        });
    };

    self.getTicker = function (options, callback) {
        var ticker, data;
        ticker = {
            timestamp: util.timestampNow(),
            error:"",
            data: []
        };
        getOneTicker(options, function(err, oneTicker) {
            if (err) {
                ticker.error = err.message;
                return callback(err, ticker);
            }
            ticker.timestamp = oneTicker.timestamp;
            ticker.data.push(oneTicker.data[0]);
            callback(null, ticker);
        });
    };


    self.getOrderBook = function (options, callback) {
        var symbol;
        symbol = typeof options.pair === "string" && options.pair.replace("XBT", "BTC").toLowerCase() || "";
        bitfinexPublic.orderbook(symbol, function (err, bitfinexOrderBook) {
            // https://www.bitfinex.net/api/order_book/
            var price, volume, order, orderBook, data;
            orderBook = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err)
                return callback(err, orderBook);
            data = {
                pair: options.pair,
                asks: [],
                bids: []
            };
            orderBook.data.push(data);
            bitfinexOrderBook.asks.forEach(function (element, index, asks) {
                order = {
                    price: parseFloat(element.price),
                    volume: parseFloat(element.amount)
                };
                orderBook.data[0].asks.push(order);
            });
            bitfinexOrderBook.bids.forEach(function (element, index, bids) {
                order = {
                    price: parseFloat(element.price),
                    volume: parseFloat(element.amount)
                };
                orderBook.data[0].bids.push(order);
            });
            callback(null, orderBook);
        });
    };

    self.getTrades = function (options, callback) {
        var trades;
        var err = new Error("Method not implemented");
        trades = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, trades);
    };

    self.getFee = function (options, callback) {
        var result;
        var err = new Error("Method not implemented");
        result = {
            timestamp: util.timestampNow(),
            error: err && err.message || "",
            data: []
        };
        if (err)
            return callback(err, result);
        return callback(null, result);
    };

    self.getTransactions = function (options, callback) {
        var transactions;
        var err = new Error("Method not implemented");
        transactions = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, transactions);
    };

    self.getBalance = function (options, callback) {
        var result;
        result = {
            timestamp: "",
            error: "",
            data: []
        };
        bitfinexPrivate.wallet_balances(function (err, bitfinexBalance) {
            var data, currency, amount, accountIndex, oneBalance;
            result.timestamp = util.timestampNow();
            if (err) {
                result.error = err.message;
                return callback(err, result);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/MockApiResponse.json", bitfinexBalance);     // only used to create MockApiResponse file for the test unit
            bitfinexBalance.forEach(function (oneBitfinexBalance, index, arr) {
                data = {
                    account_id: oneBitfinexBalance.type,
                    total: [],
                    available: []
                };
                currency = oneBitfinexBalance.currency.toUpperCase().replace("BTC", "XBT");
                data.total.push({currency: currency, amount: parseFloat(oneBitfinexBalance.amount)});
                data.available.push({currency: currency, amount: parseFloat(oneBitfinexBalance.available)});

                accountIndex = _.findIndex(result.data, {account_id: data.account_id});
                if (accountIndex > -1) {
                    result.data[accountIndex].total = util.updateBalanceArray(result.data[accountIndex].total, data.total).slice(0);
                    result.data[accountIndex].available = util.updateBalanceArray(result.data[accountIndex].available, data.available).slice(0);
                } else
                    result.data.push(data);
            });
            return callback(null, result);
        });
    };

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

Bitfinex.prototype.properties = {
    name: "Bitfinex",              // Proper name of the exchange/provider
    slug: "bitfinex",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTrades", "getFee", "getTransactions", "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder"],
        notSupported: [],
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "BTCUSD",
        },
        {
            pair: "LTCUSD"
        },
        {
            pair: "LTCBTC"
        },
        {
            pair: "DRKUSD"
        },
        {
            pair: "DRKBTC"
        },
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
}

module.exports = Bitfinex;
