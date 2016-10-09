'use strict';

var moment = require('moment');
var GDAX = require('gdax');
var _ = require('lodash');

var util = require("./util"); //custom functions

function Gdax (options) {
    const self = this;
    self["options"] = options;

    var apiUri = options.sandbox ? 'https://api-public.sandbox.exchange.coinbase.com' : undefined;
    var publicClient = new GDAX.PublicClient();
    // publicClient.productID = "BTC-USD";

    var privateClient = new GDAX.AuthenticatedClient(
         options.key, options.secret, options.passphrase, apiUri);

    self.getRate = function (options, callback) {
        self.getTicker(options, function(err, ticker) {
            let rate = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if (err) {
                rate.error = err.message;
                return callback(err, rate);
            }

            rate.timestamp = ticker.timestamp;
            let data = {
                pair: ticker.data[0].pair,
                rate: ticker.data[0].last
            };
            rate.data.push(data);
            callback(err, rate);
        });
    };

    self.getTicker = function (options, callback) {
        publicClient.productID = options.pair.replace('_', '-') || 'xxx-xxx';
        publicClient.getProductTicker(function(err, resp, xResult){
            let ticker = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };

            if(err || resp.statusCode !== 200) {
              let error  = err || new Error(`Error ${resp.statusCode}: ${resp.body}`);
              ticker.error = error.message;
              return callback(error, ticker);
            }

          // require("jsonfile").writeFileSync(__dirname + "/gdax-getTicker_MockApiResponse.json", xResult, {spaces: 2});     // only used to create MockApiResponse file for the test unit
            let data = {
                pair: options.pair,
                last: xResult.price,
                bid: xResult.bid,
                ask: xResult.ask,
                volume: xResult.volume
            };
            ticker.data.push(data);
            callback(null, ticker);
        });
    };

    self.getOrderBook = function (options, callback) {
        publicClient.productID = options.pair.replace('_', '-') || 'xxx-xxx';
        publicClient.getProductOrderBook({level:3}, function(err, resp, xResult){
            let result = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };

            if(err || resp.statusCode !== 200) {
                let error  = err || new Error(`Error ${resp.statusCode}: ${resp.body}`);
                result.error = error.message;
                return callback(error, result);
            }

            //require("jsonfile").writeFileSync(__dirname + "/gdax-getOrderBook_MockApiResponse.json", xResult, {spaces: 2});     // only used to create MockApiResponse file for the test unit
            let data = {
                pair: options.pair,
                asks: [],
                bids: [],
            };

            data.asks = _.map(xResult.asks, ask => {
                return {
                  price: ask[0],
                  volume: ask[1],
                };
            });

            data.bids = _.map(xResult.bids, bid => {
                return {
                  price: bid[0],
                  volume: bid[1],
                }
            });

            result.data.push(data);
            callback(err, result);
        });

    };

    self.getTrades = function (options, callback) {
        publicClient.productID = options.pair.replace('_', '-') || 'xxx-xxx';
        publicClient.getProductTrades({}, function(err, resp, coinbaseTrades){
            let result = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };

            if(err || resp.statusCode !== 200) {
                let error  = err || new Error(`Error ${resp.statusCode}: ${resp.body}`);
                result.error = error.message;
                return callback(error, result);
            }

            //require("jsonfile").writeFileSync(__dirname + "/gdax-getTrades_MockApiResponse.json", coinbaseTrades, {spaces: 2});     // only used to create MockApiResponse file for the test unit
            let data = {
                pair: options.pair,
                trades: [],
            };

            data.trades = _.map(coinbaseTrades, trade => {
                return {
                  timestamp: util.timestamp(moment.utc(trade.time).format('X')),
                  trade_id: trade.trade_id.toString(),
                  price: trade.price,
                  amount: trade.size,
                  type: trade.side,
                }
            });
            result.data.push(data);
            callback(err, result);
            });
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
        privateClient.getAccounts(function(err, response, accounts){
            let balance;
            balance = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if(err || resp.statusCode !== 200) {
                let error  = err || new Error(`Error ${resp.statusCode}: ${resp.body}`);
                result.error = error.message;
                return callback(error, result);
            }

            //require("jsonfile").writeFileSync(__dirname + "/gdax-getBalance_MockApiResponse.json", accounts, {spaces: 2});     // only used to create MockApiResponse file for the test unit
            _.each(accounts, function(account){
                let data = {
                  account_id: account.id,
                  total: [],
                  available: []
                };

                data.total = [
                    {
                        currency: account.currency,
                        amount: account.balance,
                    }
                    ];

                data.available = [
                    {
                        currency: account.currency,
                        amount: account.available,
                    }
                    ];
                 balance.data.push(data);
          });
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
    }
}

Gdax.prototype.properties = {
    name: "Gdax",              // Proper name of the exchange/provider
    slug: "gdax",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTransactions", "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder", "getActiveOffers", "postOffer", "cancelOffer"],
        notSupported: ["getFee", "getLendBook"]
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "BTC_USD"
        }
    ],
    publicAPI: {
        supported: true,            // is public API (not requireing user authentication) supported by this exchange?
        requires: []                // required parameters
    },
    privateAPI: {
        supported: true,            // is public API (requireing user authentication) supported by this exchange?
        requires: ["key", "secret", "passphrase"]
    },
    marketOrder: true,             // does it support market orders?
    infinityOrder: false,           // does it supports infinity orders?
                                    // (which means that it will accept orders bigger then the current balance and order at the full balance instead)
    monitorError: "",               //if not able to monitor this exchange, please set it to an URL explaining the problem
    tradeError: ""                  //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = Gdax;
