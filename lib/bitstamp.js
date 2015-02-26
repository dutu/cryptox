"use strict";

var moment = require("moment");
var _ = require("lodash");
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

    var checkErr = function (err, result) {     // arguments are the result from BITSTAMP module,
                                                // returns the error (as Error object type) or null id no error
        if (err instanceof Error)
            return err;
        if (typeof err === "string")
            return new Error(err);
        if (result && typeof result.error === "string")
            return new Error(result.error);
    };

    self.getRate = function (options, callback) {
        self.getTicker(options, function(err, result) {
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
            rate.timestamp = result.timestamp;
            data = {
                pair: result.data[0].pair,
                rate: result.data[0].last
            };
            rate.data.push(data);
            callback(err, rate);
        });
    };

    self.getTicker = function (options, callback) {
        // https://www.bitstamp.net/api/ticker/
        var ticker, data;
        bitstampPublic.ticker(function(xErr, bitstampTicker) {
            var err = checkErr(xErr, bitstampTicker);
            ticker = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err)
                return callback(err, ticker);

            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse-user_transactions.json", bitstampTicker);     // only used to create MockApiResponse file for the test unit
            ticker.timestamp = util.timestamp(bitstampTicker.timestamp);
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
            callback(null, ticker);
        })
    };

    self.getOrderBook = function (options, callback) {
        var orderBook, data;
        bitstampPublic.order_book(function (xErr, bitstampOrderBook) {
            // https://www.bitstamp.net/api/order_book/
            var price, volume, order;
            var err = checkErr(xErr, bitstampOrderBook);
            orderBook = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, orderBook);
            }
            orderBook.timestamp = util.timestamp(bitstampOrderBook.timestamp);
            data = {
                pair: self.properties.instruments[0].pair,
                asks: [],
                bids: []
            };
            orderBook.data.push(data);
            bitstampOrderBook.asks.forEach(function (element, index, asks) {
                order = {
                    price: parseFloat(asks[index][0]),
                    volume: parseFloat(asks[index][1])
                };
                orderBook.data[0].asks.push(order);
            });
            bitstampOrderBook.bids.forEach(function (element, index, bids) {
                order = {
                    price: parseFloat(bids[index][0]),
                    volume: parseFloat(bids[index][1])
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
        bitstampPrivate.balance(function (xErr, bitstampBalance) {
            var fee, data;
            var err = checkErr(xErr, bitstampBalance);
            fee = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, fee);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse-user_transactions.json", bitstampBalance);     // only used to create MockApiResponse file for the test unit
            data = {
                pair: "",
                maker_fee: parseFloat(bitstampBalance.fee) / 100, // note that Bitstamp native API call returns 0.2 for 0.2%
                taker_fee: parseFloat(bitstampBalance.fee) / 100
            };
            fee.data.push(data);
            callback(null, fee);
        });
    };

    self.getTransactions = function (options, callback) {
        var limit;
/*        if (options.hasOwnProperty("limit"))
            limit = options.limit;
        else
            limit = undefined;
*/
        bitstampPrivate.user_transactions(options, function (xErr, xTransactions) {
            var transactions, amount;
            var err = checkErr(xErr, xTransactions);
            transactions = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, transactions);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse-user_transactions.json", xTransactions);     // only used to create MockApiResponse file for the test unit
            xTransactions.forEach(function (element, index, array) {
                var btc, usd, tx;
                transactions.data.push(
                    {
                        tx_id: "",
                        datetime: "",
                        type: "",
                        symbol: "",
                        amount_base: 0,
                        amount_counter: 0,
                        rate: 0,
                        fee_base: 0,
                        fee_counter: 0,
                        order_id: "",
                        add_info: ""
                    });
                tx = transactions.data[transactions.data.length - 1];
                tx.tx_id = element.id.toString();
                tx.datetime = moment(element.datetime).utc().format();
                btc  = parseFloat(element.btc);
                usd  = parseFloat(element.usd);
                switch (element.type) {
                    case 0:     // deposit
                        tx.type = "deposit";
                        if (btc > 0) {
                            tx.symbol = "XBT";
                            tx.amount_base = btc;
                        }
                        if (usd > 0) {
                            tx.symbol = "USD";
                            tx.amount_base = usd;
                        }
                        break;
                    case 1:     // withdrawal
                        tx.type = "withdrawal";
                        if (btc < 0) {
                            tx.symbol = "XBT";
                            tx.amount_base = btc;
                        }
                        if (usd < 0) {
                            tx.symbol = "USD";
                            tx.amount_base = usd;
                        }
                        break;
                    case 2:     // market trade
                        tx.type = element.btc < 0 ? "sell" : "buy";
                        tx.symbol = "XBTUSD";
                        tx.amount_base = btc;
                        tx.amount_counter = usd;
                        tx.rate = parseFloat(element.btc_usd);
                        tx.order_id = element.order_id ? element.order_id.toString() : "";
                        break;
                }
                tx.fee_counter = parseFloat(element.fee);
            });
            callback(null, transactions);
        });
    };

    self.getBalance = function (options, callback) {
        bitstampPrivate.balance(function (err, bitstampBalance) {
            var balance, data, amount;
            balance = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, balance);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse-user_transactions.json", bitstampBalance);     // only used to create MockApiResponse file for the test unit
            data = {
                total: [],
                available: []
            };
            amount = parseFloat(bitstampBalance.btc_balance);
            if (amount)
                data.total.push({currency: "XBT", amount: amount});
            amount = parseFloat(bitstampBalance.usd_balance);
            if (bitstampBalance.usd_balance)
                data.total.push({currency: "USD", amount: amount});
            amount = parseFloat(bitstampBalance.btc_available);
            if (amount)
                data.available.push({currency: "XBT", amount: amount});
            amount = parseFloat(bitstampBalance.usd_available);
            if (amount)
                data.available.push({currency: "USD", amount: amount});
            balance.data.push(data);
            callback(null, balance);
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
    };

    self.postSellOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, orderResult);
    };

    self.postBuyOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, orderResult);
    };

    self.cancelOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented");
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, orderResult);
    };
}

Bitstamp.prototype.properties = {
    name: "Bitstamp",              // Proper name of the exchange/provider
    slug: "bitstamp",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTrades", "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder"],
        notSupported: []
    },
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
    tradeError: ""                  //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = Bitstamp;
