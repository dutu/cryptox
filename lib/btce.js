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
    self["options"] = options;

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
    };

    self.getTicker = function (options, callback) {
        var ticker, data, btcePair;
        if (!options)
            options = {};
        btcePair = pairMap(options.pair);
        btcePublic.ticker(btcePair, function (err, btceTicker) {
            // https://btc-e.com/api/3/ticker/btc_usd
            if (err) {
                ticker = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                };
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
    };

    self.getOrderBook = function (options, callback) {
        var orderBook, data, order;
        var btcePair = pairMap(options.pair);
        btcePublic.depth(btcePair, function (err, btceDepth) {
            // https://btc-e.com/api/3/depth/btc_usd
            if (err) {
                orderBook = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                };
            } else {
                orderBook = {
                    timestamp: util.timestampNow(),
                    error: "",
                    data: []
                };
                data = {
                    pair: pairMap(btcePair),
                    asks: [],
                    bids: []
                };
                orderBook.data.push(data);
                btceDepth.asks.forEach(function (element, index, asks) {
                    order = {
                        price: element[0],
                        volume: element[1]
                    };
                    orderBook.data[0].asks.push(order);
                });
                btceDepth.bids.forEach(function (element, index, bids) {
                    order = {
                        price: element[0],
                        volume: element[1]
                    };
                    orderBook.data[0].bids.push(order);
                });
            }
            callback(err, orderBook);
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
        var fee, data;
        var btcePair = pairMap(self.properties.instruments[0].pair);
        btcePublic.fee(btcePair, function (err, btceFee) {
            // https://btc-e.com/api/2/btc_usd/fee
            fee = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if (err) {
                fee.error = err.message;
                return  callback(err, fee);
            }
                data = {
                    pair: pairMap(btcePair),
                    maker_fee: btceFee.trade / 100,
                    taker_fee: btceFee.trade / 100
                };
                fee.data.push(data);
            callback(null, fee);
        });
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
        var balance;
        var err = new Error("Method not implemented");
        balance = {
            account_id: "",
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, balance);
    };

    self.getOpenOrders = function (options, callback) {
        var pair;
        var openOrders = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };
        if (options && options.hasOwnProperty("pair")) {
            pair = pairMap(options["pair"])
        }
        btcePrivate.activeOrders(pair, function (err, result) {
            var record;
            openOrders.timestamp = util.timestampNow();      // we update the tiomestamp due to the callback
            if (!err) {
                // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", result);     // only used to create MockApiResponse file for the test unit
                var activeOrders = result["return"];
                for (record in activeOrders) {
                    var newOrder = {
                        order_id: record.toString(),
                        pair: pairMap(activeOrders[record].pair),      //btc_usd
                        type: activeOrders[record].type,               // 'buy'
                        amount: activeOrders[record].amount,           // 2.85811
                        rate: activeOrders[record].rate,               // 444.064
                        status: activeOrders[record].status.toString(),           // 0
                        created_at: util.timestamp(activeOrders[record].timestamp_created)      // 1396619879
                    };
                    openOrders.data.push(newOrder);
                }
            }
            if (err && err.message === privateConfig.activeOrders_noOrdersReturnMsg)
            // if we have the error "Error: no orders" we will not return error
                err = null;
            openOrders.error = err ? err.message : "";
            callback(err, openOrders);
        });
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

    var pairMap = function (pair) { // converts pairString to different format
    // (to map string format used by cryptox pair to/from format used by btc-e npm module
    // Example "BTCUSD" to "btc_usd" or "btc_usd" to "BTCUSD"
    // If input string is not 6 characters or doesn't contain one "_", the function returns the input string (unmodified)
    //Example "BTCUSD" to "btc_usd"
        var currency1, currency2, currency;
        if (typeof pair !== "string")
            return "";
        if(pair.length == 6) {
            currency1 = pair.slice(0,3).replace("XBT", "BTC").toLowerCase();
            currency2 = pair.slice(3).replace("XBT", "BTC").toLowerCase();
            return currency1 + "_" + currency2;
        }
        //Example "btc_usd" to "BTCUSD"
        currency = pair.split("_");
        if(currency.length != 2)
            return pair;
        return currency[0].toUpperCase().replace("BTC", "XBT") + currency[1].toUpperCase().replace("BTC", "XBT");
    };
}

Btce.prototype.properties = {
    name: "BTC-e",              // Proper name of the exchange/provider
    slug: "btce",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTrades", "getTransactions",
            "getBalance", "postSellOrder", "postBuyOrder", "cancelOrder"],
        notSupported: ["getLendBook", "getActiveOffers", "postOffer", "cancelOffer"]
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "XBTUSD"
        },
        {
            pair: "XBTRUR"
        },
        {
            pair: "XBTEUR"
        },
        {
            pair: "XBTCNH"
        },
        {
            pair: "XBTGPB"
        },
        {
            pair: "LTCXBT"
        },
        {
            pair: "LTCUSD"
        },
        {
            pair: "LTCRUR"
        },
        {
            pair: "LCTEUR"
        },
        {
            pair: "LCTCNH"
        },
        {
            pair: "LCTGPB"
        },
        {
            pair: "NMCXBT"
        },
        {
            pair: "NMCUSD"
        },
        {
            pair: "NVCXBT"
        },
        {
            pair: "NVCUSD"
        },
        {
            pair: "USDRUR"
        },
        {
            pair: "EURUSD"
        },
        {
            pair: "EURRUR"
        },
        {
            pair: "USDCHN"
        },
        {
            pair: "GBPUSD"
        },
        {
            pair: "PPCXBT"
        },
        {
            pair: "PPCUSD"
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
    tradeError: ""                  //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = Btce;
