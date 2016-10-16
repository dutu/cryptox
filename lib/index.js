
"use strict";

const _ = require("lodash");
const moment = require("moment");

const util = require("./util"); //custom functions

function Cryptox (exchangeSlug, options) {
    if (!(this instanceof Cryptox)){
        return new Cryptox(exchangeSlug, options);      // allow to call constructor without new
    }

    let Exchange = require("./" + exchangeSlug);
    this.properties = {
        defaults: {
            getTransactions: {
                limit: 50,
                sort: "desc"
            }
        }
    };
    _.assign(this.properties, Exchange.prototype.properties);
    this.options = options || {};
    this.exchange = new Exchange(this.options);
}

function checkMethod (methodName) {
    if (this.properties.methods.notSupported.indexOf(methodName) > -1)
        return new Error("Method not supported");
    if (this.properties.methods.implemented.indexOf(methodName) === -1)
        return new Error("Method not implemented");
    return null;
}

function addDefaults (method, options) {
    _.forIn(this.properties.defaults[method], function (value, key) {
        if (!options.hasOwnProperty(key)) {
            options[key] = value;
        }
    });
}

Cryptox.prototype.getRate = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getRate")) {
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});
    }

    this.exchange.getRate(options, function (err, rate){
        callback(err, rate);
    });
};

Cryptox.prototype.getTicker = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getTicker")){
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});
    }

    this.exchange.getTicker(options, function (err, ticker){
        callback(err, ticker);
    });
};

Cryptox.prototype.getOrderBook = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getOrderBook"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getOrderBook(options, function (err, orderBook){
        callback(err, orderBook);
    });
};

Cryptox.prototype.getTrades = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getTrades"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getTrades(options, function (err, trades){
        callback(err, trades);
    });
};

Cryptox.prototype.getFee = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getFee"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getFee(options, function (err, fee){
        callback(err, fee);
    });
};

Cryptox.prototype.getTransactions = function (options, callback){
    let method = "getTransactions";
    let err = checkMethod.call(this, method);      // check is method is supported/implemented

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

    if (!err && options.hasOwnProperty("limit") && !(typeof options.limit === "number" && options.limit % 1 === 0)) // limit must be a number and integer
        err = new Error("Invalid 'limit' argument");

    if (err)
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    addDefaults.call(this, method, options);
    this.exchange.getTransactions(options, function (err, transactions){
        callback(err, transactions);
    });
};

Cryptox.prototype.getBalance = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getBalance"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getBalance(options, function (err, balance){
        callback(err, balance);
    });
};

Cryptox.prototype.getMarginPositions = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getMarginPositions"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getMarginPositions(options, function (err, balance){
        callback(err, balance);
    });
};

Cryptox.prototype.getOpenOrders = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "getOpenOrders"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getOpenOrders(options, function (err, openOrders){
        callback(err, openOrders);
    });
};

Cryptox.prototype.postSellOrder = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "postSellOrder"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.postSellOrder(options, function (err, orderResult){
        callback(err, orderResult);
    });
};

Cryptox.prototype.postBuyOrder = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "postBuyOrder"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.postBuyOrder(options, function (err, orderResult){
        callback(err, orderResult);
    });
};

Cryptox.prototype.cancelOrder = function (options, callback){
    let err;
    if (err = checkMethod.call(this, "cancelOrder"))
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.cancelOrder(options, function (err, orderResult){
        callback(err, orderResult);
    });
};

Cryptox.prototype.getLendBook = function (options, callback){
    let err;
    err = checkMethod.call(this, "getLendBook");

    if (!err && !(typeof options.currency === "string"))
        err = new Error("Invalid 'currency' argument");

    if (err)
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getLendBook(options, function (err, orderBook){
        callback(err, orderBook);
    });
};

Cryptox.prototype.getActiveOffers = function (options, callback){
    let err;
    err = checkMethod.call(this, "getActiveOffers");

    if (err)
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getActiveOffers(options, function (err, orderBook){
        callback(err, orderBook);
    });
};

Cryptox.prototype.postOffer = function (options, callback){
    let err;
    err = checkMethod.call(this, "postOffer");

    if (err)
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getActiveOffers(options, function (err, orderBook){
        callback(err, orderBook);
    });
};

Cryptox.prototype.cancelOffer = function (options, callback){
    let err;
    err = checkMethod.call(this, "cancelOffer");

    if (err)
        return callback(err, {timestamp: util.timestampNow(), error: err.message, data: []});

    this.exchange.getActiveOffers(options, function (err, orderBook){
        callback(err, orderBook);
    });
};



module.exports = Cryptox;
