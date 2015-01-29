
"use strict";

function Cryptox (exchangeSlug, options) {
    var self = this;
    var Exchange = require("./lib/" + exchangeSlug);
    var locales = require("./lib/locales");

    self.properties = Exchange.prototype.properties;
    self.options = options;
    if (!self.options.hasOwnProperty(lang))
        self.options["lang"]="en";            // set default language to "en" (english)

    var exchange = new Exchange(options);

    self.getTicker = function (options, callback){
        exchange.getTicker(options, function (err, ticker){
            callback(err, ticker);
        });
    }

    self.getOrderBook = function (options, callback){
        exchange.getOrderBook(options, function (err, orderBook){
            callback(err, orderBook);
        });
    }

    self.getTrades = function (options, callback){
        exchange.getTrades(options, function (err, trades){
            callback(err, trades);
        });
    }

    self.getFee = function (options, callback){
        exchange.getFee(options, function (err, fee){
            callback(err, fee);
        });
    }

    self.getTransactions = function (options, callback){
        exchange.getTransactions(options, function (err, transactions){
            callback(err, transactions);
        });
    }

    self.getBalance = function (options, callback){
        exchange.getBalance(options, function (err, balance){
            callback(err, balance);
        });
    }

    self.getOpenOrders = function (options, callback){
        exchange.getOpenOrders(options, function (err, openOrders){
            callback(err, openOrders);
        });
    }

    self.postSellOrder = function (options, callback){
        exchange.postSellOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    }

    self.postBuyOrder = function (options, callback){
        exchange.postBuyOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    }

    self.cancelOrder = function (options, callback){
        exchange.cancelOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    }
}
module.exports = Cryptox;
