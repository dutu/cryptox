
"use strict";

var path = require("path");

var util = require("./lib/util"); //custom functions

function Cryptox (exchangeSlug, options) {
    if (!(this instanceof Cryptox)){
        return new Cryptox(exchangeSlug, options);      // allow to call constructor without new
    }
    var self = this;
    var Exchange = require("./lib/" + exchangeSlug);
    var locales = require("./lib/locales");

    self.properties = Exchange.prototype.properties;
    self.options = options || {};
    if (!self.options.hasOwnProperty("lang"))
        self.options["lang"]="en";            // set default language to "en" (english)

    var exchange = new Exchange(self.options);

    var checkMethod = function (methodName) {
        if (self.properties.methods.notImplemented.indexOf(methodName) > -1)
            return new Error("Method not implemented");
        if (self.properties.methods.notSupported.indexOf(methodName) > -1)
            return new Error("Method not supported");
        return null;
    };

    self.getRate = function (options, callback){
        var err;
        if (err = checkMethod("getRate"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getRate(options, function (err, rate){
            callback(err, rate);
        });
    }

    self.getTicker = function (options, callback){
        var err;
        if (err = checkMethod("getTicker"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getTicker(options, function (err, ticker){
            callback(err, ticker);
        });
    }

    self.getOrderBook = function (options, callback){
        var err;
        if (err = checkMethod("getOrderBook"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getOrderBook(options, function (err, orderBook){
            callback(err, orderBook);
        });
    }

    self.getTrades = function (options, callback){
        var err;
        if (err = checkMethod("getTrades"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getTrades(options, function (err, trades){
            callback(err, trades);
        });
    }

    self.getFee = function (options, callback){
        var err;
        if (err = checkMethod("getFee"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getFee(options, function (err, fee){
            callback(err, fee);
        });
    }

    self.getTransactions = function (options, callback){
        var err;
        if (err = checkMethod("getTransactions"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getTransactions(options, function (err, transactions){
            callback(err, transactions);
        });
    }

    self.getBalance = function (options, callback){
        var err;
        if (err = checkMethod("getBalance"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getBalance(options, function (err, balance){
            callback(err, balance);
        });
    }

    self.getOpenOrders = function (options, callback){
        var err;
        if (err = checkMethod("getOpenOrders"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getOpenOrders(options, function (err, openOrders){
            callback(err, openOrders);
        });
    }

    self.postSellOrder = function (options, callback){
        var err;
        if (err = checkMethod("postSellOrder"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.postSellOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    }

    self.postBuyOrder = function (options, callback){
        var err;
        if (err = checkMethod("postBuyOrder"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.postBuyOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    }

    self.cancelOrder = function (options, callback){
        var err;
        if (err = checkMethod("cancelOrder"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.cancelOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    }
}
module.exports = Cryptox;
