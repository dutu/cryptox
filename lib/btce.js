"use strict";

var async = require("async");
var BTCE = require("btc-e");
var _ = require("lodash");
var moment = require("moment");
var StringScanner = require("strscan").StringScanner;
var BigNumber = require("bignumber.js");

var util = require("./util"); //custom functions

function Btce (options) {
    var btcePublic, btcePrivate;
    var self = this;
    self[options] = options;

    var privateConfig = {
        activeOrders_noOrdersReturnMsg: "no orders",     // the error message returned by BTC-e's ActiveOrders API when no active orders
        tradeOrders_noOrdersReturnMsg: "no trades",       // the error message returned by BTC-e's TradeOrders API when no active orders
        transOrders_noOrdersReturnMsg: "no trans"       // the error message returned by BTC-e's TradeOrders API when no active orders
    };

    btcePublic = new BTCE();        // create an object which will be used for public API calls

    if (typeof options.key === "string" && typeof options.secret === "string") {
        btcePrivate = new BTCE(options.key, options.secret);
    } else {
        btcePrivate = btcePublic;
    }

    self.getTicker = function (options, callback) {
        var ticker, data;
        var btcePair = pairMap(options["pair"]);
        btcePublic.ticker(btcePair, function (err, btceTicker) {
            // https://btc-e.com/api/3/ticker/btc_usd
            if (err) {
                ticker = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                }
            } else {
                ticker = {
                    timestamp: util.timestamp(btceTicker.ticker.updated),
                    error: "",
                    data: []
                };
                data = {
                    pair: pairMap(btcePair),
                    last: btceTicker.ticker.last,
                    bid: btceTicker.ticker.sell,
                    ask: btceTicker.ticker.buy,
                    volume: btceTicker.ticker.vol_cur
                };
                ticker.data.push(data);
            }
            callback(err, ticker);
        });
    }

    self.getOrderBook = function (options, callback) {
        var orderBook, data;
        var btcePair = pairMap(options.pair);
        btcePublic.depth(btcePair, function (err, btceDepth) {
            // https://btc-e.com/api/3/depth/btc_usd
            if (err) {
                orderBook = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                }
            } else {
                orderBook = {
                    timestamp: util.timestampNow(),
                    error: "",
                    data: []
                };
                data = {
                    pair: pairMap(btcePair),
                    asks: btceDepth.asks,
                    bids: btceDepth.bids
                };
                orderBook.data.push(data);

            }
            callback(err, orderBook);
        });
    }

    self.getTrades = function (options, callback) {
        var trades;
        var err = new Error("Method not implemented")
        trades = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, trades);
    }

    self.getFee = function (options, callback) {
        var fee, err, data, fixedFee
        fixedFee = self.properties.fee;           // fee is hardcodded and fixed
        err = null;
        fee = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        }
        data = {
            pair: options.pair,
            fee: fixedFee
        };
        fee.data.push(data);
        callback(err, fee);
    }

    self.getTransactions = function (options, callback) {
        var transactions;
        var err = new Error("Method not implemented")
        transactions = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, transactions);
    }

    self.getBalance = function (options, callback) {
        var balance;
        var err = new Error("Method not implemented")
        balance = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, balance);
    }

    self.getOpenOrders = function (options, callback) {
        var pair;
        var openOrders = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };
        if (!btcePrivate) {
            var err = new Error("API key not specified");
            openOrders.error = err.message;
            callback(err, openOrders);
            return;
        }
        if (options && options.hasOwnProperty("pair")) {
            pair = pairMap(options["pair"])
        }
        btcePrivate.activeOrders(pair, function (err, result) {
            openOrders.timestamp = util.timestampNow();      // we update the tiomestamp due to the callback
            if (!err) {
                var activeOrders = result["return"];
                for (var record in activeOrders) {
                    var newOrder = {
                        order_id: record.toString(),
                        pair: pairMap(activeOrders[record].pair),      //btc_usd
                        type: activeOrders[record].type,               // 'buy'
                        amount: activeOrders[record].amount,           // 2.85811
                        rate: activeOrders[record].rate,               // 444.064
                        status: activeOrders[record].status,           // 0
                        created_at: util.timestamp(activeOrders[record].timestamp_created)      // 1396619879
                    };
                    openOrders.data.push(newOrder);
                }
            }
            if (err && err.message === privateConfig.activeOrders_noOrdersReturnMsg)
            // if we have the error "Error: no orders" we will not return error
                err = null
            openOrders.error = err ? err.message : "";
            callback(err, openOrders);
        });
    }

    self.postSellOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }

    self.postBuyOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }

    self.cancelOrder = function (options, callback) {
        var orderResult;
        var err = new Error("Method not implemented")
        orderResult = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        }
        callback(err, orderResult);
    }

    var pairMap = function (pairString) { // converts pairString to different format
    // (to map string format used by cryptox pair to/from format used by btc-e npm module
    // Example "BTCUSD" to "btc_usd" or "btc_usd" to "BTCUSD"
    // If input string is not 6 characters or doesn't contain one "_", the function returns the input string (unmodified)
    //Example "BTCUSD" to "btc_usd"
        var currency1, currency2;
        if (typeof pairString !== "string")
            return "";
        if(pairString.length == 6) {
            currency1 = pairString.slice(0,3).toLowerCase();
            currency2 = pairString.slice(3).toLowerCase();
            return currency1 + "_" + currency2;
        }
        //Example "btc_usd" to "BTCUSD"
        var currency = pairString.split("_");
        if(currency.length != 2)
            return pairString;
        return currency[0].toUpperCase() + currency[1].toUpperCase();
    };
}

Btce.prototype.properties = {
    name: "BTC-e",              // Proper name of the exchange/provider
    slug: "btce",               // slug name of the exchange. Needs to be the same as the .js filename
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
            pair: "LTCBTC"
        },
        {
            pair: "LTCUSD"
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

module.exports = Btce;
