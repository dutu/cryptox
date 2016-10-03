'use strict';

const moment = require("moment");
const _ = require('lodash');
const async = require('async');
const POLONIEX = require('poloniex-api-node');
const Big = require('big.js');

const util = require("./util"); //custom functions

function Poloniex (options) {
    const self = this;
    let poloniexPublic, poloniexPrivate;
    self["options"] = options;

    poloniexPublic = new POLONIEX();
    if (typeof options['key'] === 'string' && typeof options['secret'] === 'string') {
        poloniexPrivate = new POLONIEX(options.key, options.secret);
    } else {
        poloniexPrivate = poloniexPublic;
    }

    self.getRate = function (options, callback) {
        self.getTicker(options, function(err, ticker) {
            let result = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if (err) {
                result.error = err.message;
                return callback(err, result);
            }
            result.timestamp = ticker.timestamp;
            let data = {
                pair: ticker.data[0].pair,
                rate: ticker.data[0].last
            };
            result.data.push(data);
            callback(null, result);
        });
    };

    self.getTicker = function (options, callback) {
        poloniexPublic.returnTicker(function(err, xResult) {
            let result = {
                timestamp: util.timestampNow(),
                error: '',
                data: []
            };

            if (err || xResult.hasOwnProperty('error')) {
                let error = err  || new Error(xResult.error);
                result.error = err.message;
                return callback(error, result);
            }

            // let jf = require("jsonfile").writeFileSync(__dirname + "/poloniex-getTicker_MockApiResponse.json", xResult);     // only used to create MockApiResponse file for the test unit
           _.forEach(xResult, function(value, key) {
                let currencies = key.split('_');
                let pair = `${currencies[0]}${currencies[1]}`.replace("BTC", "XBT");
                let data = {
                    pair: pair,
                    last: value.last,
                    bid: value.highestBid,
                    ask: value.lowestAsk,
                    volume: value.baseVolume,
                    high: value.high24hr,
                    low: value.low24hr
                };
                if (!options.hasOwnProperty('pair') || options.pair === data.pair) {
                    result.data.push(data);
                }
            });
            return callback(null, result);
        });
    };

    self.getOrderBook = function (options, callback) {
        let pair;
        if (options.hasOwnProperty('pair')) {
            let currencyA = options.pair.substr(0,3).replace(/xbt/i, 'btc').toLocaleUpperCase();
            let currencyB = options.pair.substr(3,3).replace(/xbt/i, 'btc').toLocaleUpperCase();
            pair = `${currencyA}_${currencyB}`;
        } else {
            pair = "";
        }

        let depth = 10000;
        poloniexPublic.returnOrderBook(pair, depth, function(err, xResult) {
            // let jf = require("jsonfile").writeFileSync(__dirname + "/poloniex-getOrderBook_MockApiResponse.json", xResult, {spaces: 2});     // only used to create MockApiResponse file for the test unit
            let result = {
                timestamp: util.timestampNow(),
                error: '',
                data: []
            };

            if (err || xResult.hasOwnProperty('error')) {
                let error = err  || new Error(xResult.error);
                result.error = err.message;
                return callback(error, result);
            }

            let data = {
                pair: options.pair,
                asks: [],
                bids: []
            };
            result.data.push(data);
            xResult.asks.forEach(function (element, index, asks) {
                let order = {
                    price: element[0],
                    volume: element[1].toString(),
                };
                result.data[0].asks.push(order);
            });
            xResult.bids.forEach(function (element, index, bids) {
                let order = {
                    price: element[0],
                    volume: element[1].toString(),
                };
                result.data[0].bids.push(order);
            });
            return callback(null, result);
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
        var fee;
        var err = new Error("Method not implemented");
        fee = {
            timestamp: util.timestampNow(),
            error: err.message,
            data: []
        };
        callback(err, fee);
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
        let result = {
            timestamp: util.timestampNow(),
            error: '',
            data: []
        };
        let dataMarginAccount;
        async.series([
            function(callback) {
                let account = null;
                poloniexPrivate.returnCompleteBalances(account, function(err, xResult) {
                    // let jf = require("jsonfile").writeFileSync(__dirname + "/poloniex-getBalance-returnCompleteBalances_MockApiResponse.json", xResult, {spaces: 2});     // only used to create MockApiResponse file for the test unit
                    if (err || xResult.hasOwnProperty('error')) {
                        let error = err  || new Error(xResult.error);
                        result.error = err.message;
                        return callback(error, 'error');
                    }

                    let data = {
                        account_id: 'exchange',
                        total: [],
                        available: [],
                    };
                    _.forEach(xResult, function (value, key) {
                        if (!Big(value.available).eq(0) || !Big(value.onOrders).eq(0)) {
                            let available = {
                                currency: key.replace(/\bbtc\b/i, 'XBT').toUpperCase(),
                                amount: value.available,
                            };
                            data.available.push(available);
                            let total = {
                                currency: key.replace(/\bbtc\b/i, 'XBT').toUpperCase(),
                                amount: Big(value.available).plus(value.onOrders).toString(),
                            };
                            data.total.push(total);
                        }
                    });
                    result.data.push(data);
                    return callback(null, 'ok');
                });
            },
            function(callback){
                let account = 'margin';
                poloniexPrivate.returnAvailableAccountBalances(account, function(err, xResult) {
                    // let jf = require("jsonfile").writeFileSync(__dirname + "/poloniex-getBalance-returnAvailableAccountBalances_MockApiResponse.json", xResult, {spaces: 2});     // only used to create MockApiResponse file for the test unit
                    if (err || xResult.hasOwnProperty('error')) {
                        let error = err  || new Error(xResult.error);
                        result.error = err.message;
                        return callback(error, 'error');
                    }

                    dataMarginAccount = {
                        account_id: 'margin',
                        total: [],
                        available: [],
                    };
                    _.forEach(xResult.margin, function (value, key) {
                        let total = {
                            currency: key.replace(/\bbtc\b/i, 'XBT').toUpperCase(),
                            amount: value,
                        };
                        dataMarginAccount.total.push(total);
                    });
                    result.data.push(dataMarginAccount);
                    return callback(null, 'ok');
                });
            },
            function(callback){
                poloniexPrivate.returnTradableBalances(function(err, xResult) {
                    // let jf = require("jsonfile").writeFileSync(__dirname + "/poloniex-getBalance-returnTradableBalances_MockApiResponse.json", xResult, {spaces: 2});     // only used to create MockApiResponse file for the test unit
                    if (err || xResult.hasOwnProperty('error')) {
                        let error = err  || new Error(xResult.error);
                        result.error = err.message;
                        return callback(error, 'error');
                    }
                    let availableBTC = null;
                    _.forEach(xResult, function (value, key) {
                        if (!availableBTC) {
                            availableBTC = {
                                currency: 'XBT',
                                amount: value.BTC,
                            };
                            dataMarginAccount.available.push(availableBTC);
                        }
                        let asset = key.split('_')[1];
                        let available = {
                            currency: asset,
                            amount: value[asset],
                        };
                        dataMarginAccount.available.push(available);
                    });
                    return callback(null, 'ok');
                });
            },
            ],
            function(err, results) {
                return callback(err, result);
            }
        );

    };

    self.getOpenOrders = function (options, callback) {
        let currencyPair;
        if (options.hasOwnProperty('pair')) {
            let currencies = options.pair.split('_');
            let currencyA = currencies[0] && currencies[0].replace(/xbt/i, 'btc').toLocaleUpperCase() || '';
            let currencyB = currencies[1] && currencies[1].replace(/xbt/i, 'btc').toLocaleUpperCase() || '';
            currencyPair = `${currencyA}_${currencyB}`;
        } else {
            currencyPair = 'all';
        }

        poloniexPrivate.returnOpenOrders(currencyPair, function(err, xResult) {
            let result = {
                timestamp: util.timestampNow(),
                error: '',
                data: []
            };
            if (err || xResult.hasOwnProperty('error')) {
                let error = err  || new Error(xResult.error);
                result.error = err.message;
                return callback(error, result);
            }
            // let jf = require("jsonfile").writeFileSync(__dirname + "/poloniex-getOpenOrders-returnOpenOrders_MockApiResponse.json", xResult, {spaces: 2});     // only used to create MockApiResponse file for the test unit
            _.forEach(xResult, (order, index) => {
                let newOrder = {
                    order_id: order.orderNumber,
                    pair: options.pair,
                    type: order.type,
                    amount: order.amount,
                    rate: order.rate,
                    margin: order.margin && true || false,
                    status: "",           // 0
                    created_at: util.timestamp(moment.utc(order.date).format('X')),
                };
                result.data.push(newOrder);
            });
            return callback(null, result);
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
    }
}

Poloniex.prototype.properties = {
    name: "Poloniex",              // Proper name of the exchange/provider
    slug: "poloniex",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTrades", "getFee", "getTransactions", "postSellOrder", "postBuyOrder", "cancelOrder", "getLendBook", "getActiveOffers", "postOffer", "cancelOffer"],
        notSupported: []
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "XBTETH"
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
    tradeError: ""                  //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = Poloniex;
