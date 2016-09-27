"use strict";

var moment = require("moment");
var Gdax = require("gdax");
var publicClient = new Gdax.PublicClient();
var _ = require("lodash");

publicClient.productID = "BTC-USD";

var util = require("./util"); //custom functions

function Gdax (options) {
    var self = this;
    self["options"] = options;

    var apiUri = options.sandbox ? 'https://api-public.sandbox.exchange.coinbase.com' : undefined;
    var privateClient = new Gdax.AuthenticatedClient(
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
        var ticker = {
          timestamp: util.timestampNow(),
          error: "",
          data: []
        };

        if(options.pair && options.pair != "XBTUSD") {
          ticker.error = "Unsupported Ticker";
          return callback(new Error("NotFound"), ticker);
        }

        publicClient.getProductTicker(function(err, resp, coinbaseTicker){
          if(err || coinbaseTicker.message == "NotFound") {
            return callback(new Error(err || "NotFound"), ticker);
          }

          ticker.timestamp = coinbaseTicker.time;

          var data = {
            pair: self.properties.instruments[0].pair,
            last: parseFloat(coinbaseTicker.price),
            volume: parseFloat(coinbaseTicker.size)
          };

          ticker.data.push(data);
          callback(null, ticker);
        });
    };

    self.getOrderBook = function (options, callback) {
        var orderBook = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };

        if(options.pair && options.pair != "XBTUSD") {
          orderBook.error = "Unsupported Ticker";
          return callback(new Error("NotFound"), orderBook);
        }

        publicClient.getProductOrderBook({level:3}, function(err, resp, data){

          if(err || data.message == "NotFound") {
            return callback(new Error(err || "NotFound"), orderBook);
          }

          data.pair = self.properties.instruments[0].pair;

          data.asks = _.map(data.asks, function(ask){
            return {
              price: parseFloat(ask[0]),
              volume: parseFloat(ask[1])
            };
          });

          data.bids = _.map(data.bids, function(bid){
            return {
              price: parseFloat(bid[0]),
              volume: parseFloat(bid[1])
            }
          });

          orderBook.data.push(data);
          callback(err, orderBook);
        });

    };

    self.getTrades = function (options, callback) {
        var trades;
        trades = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };

        publicClient.getProductTrades({}, function(err, resp, coinbaseTrades){
          var data = {
            pair: self.properties.instruments[0].pair
          };

          data.buys = _.chain(coinbaseTrades).filter(function(trade){
            return trade.side === 'buy';
          }).map(function(trade){
            return { price: parseFloat(trade.price), volume: parseFloat(trade.size), timestamp: trade.time };
          }).value();

          data.sells = _.chain(coinbaseTrades).filter(function(trade){
            return trade.side === 'sell';
          }).map(function(trade){
            return { price: parseFloat(trade.price), volume: parseFloat(trade.size), timestamp: trade.time };
          }).value();

          trades.data.push(data);

          callback(err, trades);
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
        var balance;
        balance = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };
        privateClient.getAccounts(function(err, response, accounts){
          _.each(accounts, function(account){
            var data = {
              account_id: account.id,
              total: [],
              available: []
            };

            data.total = [{currency: account.currency === "BTC" ? "XBT" : account.currency,
                amount: parseFloat(account.balance)
            }];

            data.available = [{
                currency: account.currency === "BTC" ? "XBT" : account.currency,
                amount: parseFloat(account.available)
            }];

            balance.data.push(data);
          });

          callback(err, balance);
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
            pair: "XBTUSD"
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
