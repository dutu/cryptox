
"use strict";

var _ = require("lodash");
var moment = require("moment");

var util = require("./lib/util"); //custom functions

function Cryptox (exchangeSlug, options) {
    if (!(this instanceof Cryptox)){
        return new Cryptox(exchangeSlug, options);      // allow to call constructor without new
    }
    var self = this;
    var Exchange = require("./lib/" + exchangeSlug);
    var locales = require("./lib/locales");
    self.properties = {
        defaults: {
            getTransactions: {
                limit: 50,
                sort: "desc"
            }
        }
    };
    _.assign(self.properties, Exchange.prototype.properties);
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

    var addDefaults = function (method, options) {
        _.forIn(self.properties.defaults[method], function (value, key) {
            if (!options.hasOwnProperty(key)) {
                options[key] = value;
            }
        });
    };

    self.getRate = function (options, callback){
        var err;
        if (err = checkMethod("getRate"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getRate(options, function (err, rate){
            callback(err, rate);
        });
    };

    self.getTicker = function (options, callback){
        var err;
        if (err = checkMethod("getTicker"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getTicker(options, function (err, ticker){
            callback(err, ticker);
        });
    };

    self.getOrderBook = function (options, callback){
        var err;
        if (err = checkMethod("getOrderBook"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getOrderBook(options, function (err, orderBook){
            callback(err, orderBook);
        });
    };

    self.getTrades = function (options, callback){
        var err;
        if (err = checkMethod("getTrades"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getTrades(options, function (err, trades){
            callback(err, trades);
        });
    };

    self.getFee = function (options, callback){
        var err;
        if (err = checkMethod("getFee"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getFee(options, function (err, fee){
            callback(err, fee);
        });
    };

    self.getTransactions = function (options, callback){
        var method = "getTransactions";
        var err;
        err = checkMethod(method);      // check is method is supported/implemented

        if (!err && options.hasOwnProperty(("type") && options.type !== "trades" && options.type !== "movements"))
            err = new Error("Invalid 'trades' argument");

        if (!err && options.hasOwnProperty("before") && !moment(options.before, moment.ISO_8601).isValid())
            err = new Error("Invalid 'before' argument (not ISO_8601 string)");

        if (!err && options.hasOwnProperty("after") && !moment(options.after, moment.ISO_8601).isValid())
            err = new Error("Invalid 'after' argument (not ISO_8601 string)");

        if (!err && options.hasOwnProperty("before") && options.hasOwnProperty("after") && moment(options.before).isBefore(moment(options.after)))
            err = new Error("Invalid 'after'/'before' arguments ('before' < 'after')");

	    if (!err && options.hasOwnProperty("symbol") && !typeof options.symbol === "String")
		    err = new Error("Invalid 'symbol' argument");

	    if (!err && options.hasOwnProperty("symbol")) {
		    // check if supported symbol
		    var supported, pair;
		    supported = [3, 6].indexOf(options.symbol.length) > -1;
		    if (supported) {
			    var validSymbol;
			    self.properties.instruments.forEach(function (e, index, array) {
				   validSymbol = validSymbol || e.pair.indexOf(options.symbol) > -1
			    });
			    supported = validSymbol;
		    }
		    if (!supported)
			    err = new Error("Symbol value not supported by the exchange");
	    }

	    if (!err && options.hasOwnProperty("limit") && !(typeof options.limit === "number" && options.limit % 1 === 0)) // limit must be a number and integer
		    err = new Error("Invalid 'limit' argument");

	    if (err)
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

	            addDefaults(method, options);
        exchange.getTransactions(options, function (err, transactions){
            callback(err, transactions);
        });
    };

    self.getBalance = function (options, callback){
        var err;
        if (err = checkMethod("getBalance"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getBalance(options, function (err, balance){
            callback(err, balance);
        });
    };

    self.getOpenOrders = function (options, callback){
        var err;
        if (err = checkMethod("getOpenOrders"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.getOpenOrders(options, function (err, openOrders){
            callback(err, openOrders);
        });
    };

    self.postSellOrder = function (options, callback){
        var err;
        if (err = checkMethod("postSellOrder"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.postSellOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    };

    self.postBuyOrder = function (options, callback){
        var err;
        if (err = checkMethod("postBuyOrder"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.postBuyOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    };

    self.cancelOrder = function (options, callback){
        var err;
        if (err = checkMethod("cancelOrder"))
            return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

        exchange.cancelOrder(options, function (err, orderResult){
            callback(err, orderResult);
        });
    };

	self.getLendBook = function (options, callback){
		var err;
		err = checkMethod("getLendBook");

		if (!err && !(typeof options.currency === "string"))
			err = new Error("Invalid 'currency' argument");

		if (err)
			return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

		exchange.getLendBook(options, function (err, orderBook){
			callback(err, orderBook);
		});
	};

	self.getActiveOffers = function (options, callback){
		var err;
		err = checkMethod("getActiveOffers");

		if (err)
			return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

		exchange.getActiveOffers(options, function (err, orderBook){
			callback(err, orderBook);
		});
	};

	self.postOffer = function (options, callback){
		var err;
		err = checkMethod("postOffer");

		if (err)
			return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

		exchange.getActiveOffers(options, function (err, orderBook){
			callback(err, orderBook);
		});
	};

	self.cancelOffer = function (options, callback){
		var err;
		err = checkMethod("cancelOffer");

		if (err)
			return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

		exchange.getActiveOffers(options, function (err, orderBook){
			callback(err, orderBook);
		});
	};

}
module.exports = Cryptox;
