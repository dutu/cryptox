"use strict";

var moment = require("moment");
var BITX = require("bitx");

var util = require("./util"); //custom functions

function Bitx (options) {
    var bitxPublic, bitxPrivate;

    var self = this;
    self["options"] = options;

    bitxPublic = new BITX();
    if (typeof options.key === "string" && typeof options.secret === "string") {
        bitxPrivate = new BITX(options.key, options.secret);
    } else {
        bitxPrivate = bitxPublic;
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
        // TODO: return all tickers when pair parameter is not specidfied
        var ticker, data;
        var bitxPair, bitxPublic;
        if (typeof options.pair === "string")
            bitxPair = options.pair.replace("BTC", "XBT");
        else
            bitxPair = "";
        bitxPublic = new BITX({pair: bitxPair});
        bitxPublic.getTicker(function(err, bitxTicker) {
            // https://api.mybitx.com/api/1/tickers
            // https://api.mybitx.com/api/1/ticker?pair=XBTZAR
            if (err) {
                ticker = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                }
            } else {
                ticker = {
                    timestamp: util.timestamp(bitxTicker.timestamp),
                    error: "",
                    data: []
                };
                data = {
                    pair: bitxPair.replace("XBT", "BTC"),
                    last: parseFloat(bitxTicker.last_trade),
                    bid: parseFloat(bitxTicker.bid),
                    ask: parseFloat(bitxTicker.ask),
                    volume: parseFloat(bitxTicker.rolling_24_hour_volume),
                };
                ticker.data.push(data);
            }
            callback(err, ticker);
        })
    }

    self.getOrderBook = function (options, callback) {
        var orderBook, data;
        var bitxPair;
        if (typeof options.pair === "string")
            bitxPair = options.pair.replace("BTC", "XBT");
        else
            bitxPair = "";
        bitxPublic.getOrderBook(function (err, bitxOrderBook) {
            https://api.mybitx.com/api/1/orderbook?pair=XBTZAR
            var price, volume, order;
            if (err) {
                orderBook = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                }
            } else {
                orderBook = {
                    timestamp: util.timestamp(bitxOrderBook.timestamp),
                    error: "",
                    data: []
                };
                data = {
                    pair: "",
                    asks: [],
                    bids: []
                };
                orderBook.data.push(data);
                bitxOrderBook.asks.forEach (function (element, index, asks) {
                    var price =  parseFloat(asks[index].price);
                    var volume = parseFloat(asks[index].volume);
                    var order = new Array(price, volume);
                    orderBook.data[0].asks.push(order);
                });
                bitxOrderBook.bids.forEach (function (element, index, bids) {
                    var price =  parseFloat(bids[index].price);
                    var volume = parseFloat(bids[index].volume);
                    var order = new Array(price, volume);
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
        }
        callback(err, trades);
    }

    self.getFee = function (options, callback) {
        var fee;
        var err = new Error("Method not implemented");
        fee = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, fee);
    }

    self.getTransactions = function (options, callback) {
        var transactions;
        var err = new Error("Method not implemented");
        transactions = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, transactions);
    }

    self.getBalance = function (options, callback) {
        var balance;
        var err = new Error("Method not implemented");
        balance = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, balance);
    }

    self.getOpenOrders = function (options, callback) {
        var openOrders;
        var err = new Error("Method not implemented");
        openOrders = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, openOrders);
    }

    self.postSellOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }

    self.postBuyOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }

    self.cancelOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }
}

Bitx.prototype.properties = {
    name: "BitX",              // Proper name of the exchange/provider
    slug: "bitx",               // slug name of the exchange. Needs to be the same as the .js filename
    markets: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        // check on https://api.mybitx.com/api/1/tickers
        {
            pair: "BTCKES"
        },
        {
            pair: "BTCZAR"
        },
        {
            pair: "BTCMYR"
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
}

module.exports = Bitx;
