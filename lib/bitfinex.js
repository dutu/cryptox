"use strict";

var moment = require("moment");
var _ = require("lodash");
var async = require("async");
var BigNumber = require("bignumber.js");
var BITFINEX = require('bitfinex');

var util = require("./util"); //custom functions

function Bitfinex (options) {
    var bitfinexPublic, bitfinexPrivate;
    var self = this;
    self["options"] = options;

    bitfinexPublic = new BITFINEX();
    if (typeof options.key === "string" && typeof options.secret === "string")
        bitfinexPrivate = new BITFINEX(options.key, options.secret);
    else
        bitfinexPrivate = bitfinexPublic;

    var currencies = [];
    var pairs = [];
    self.properties.instruments.forEach(function (element, index, array) {
        var currency1 = element.pair.slice(0,3);
        var currency2 = element.pair.slice(3,6);
        if (currencies.indexOf(currency1) === -1)
            currencies.push(currency1);
        if (currencies.indexOf(currency2) === -1)
            currencies.push(currency2);
        if (pairs.indexOf(element.pair) === -1)
            pairs.push(element.pair);
    });
    self.properties["currencies"] = currencies;
    self.properties["pairs"] = pairs;

    self.getRate = function (options, callback) {
        getOneTicker(options, function(err, ticker) {
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
            callback(null, rate);
        });
    };

    var getOneTicker = function (options, callback) {
        var ticker, data, symbol;
        ticker = {
            timestamp: util.timestampNow(),
            error:"",
            data: []
        };
        symbol = typeof options.pair === "string" && options.pair.replace("XBT", "BTC").toLowerCase() || "";
        bitfinexPublic.ticker(symbol, function(err, bitfinexTicker) {
            if (err) {
                ticker.error = err.message === "404" ? "Invalid currency pair" : err.message;
                return callback(err, ticker);
            }
            data = {
                pair: options.pair.replace("BTC", "XBT"),
                last: parseFloat(bitfinexTicker.last_price),
                bid: parseFloat(bitfinexTicker.bid),
                ask: parseFloat(bitfinexTicker.ask),
                volume: parseFloat(bitfinexTicker.volume),
                high: parseFloat(bitfinexTicker.high),
                low: parseFloat(bitfinexTicker.low)
            };
            ticker.timestamp = util.timestamp(bitfinexTicker.timestamp);
            ticker.data.push(data);
            callback(null, ticker);
        });
    };

    self.getTicker = function (options, callback) {
        var ticker, data;
        ticker = {
            timestamp: util.timestampNow(),
            error:"",
            data: []
        };
        getOneTicker(options, function(err, oneTicker) {
            if (err) {
                ticker.error = err.message;
                return callback(err, ticker);
            }
            ticker.timestamp = oneTicker.timestamp;
            ticker.data.push(oneTicker.data[0]);
            callback(null, ticker);
        });
    };


    self.getOrderBook = function (options, callback) {
        var symbol;
        symbol = typeof options.pair === "string" && options.pair.replace("XBT", "BTC").toLowerCase() || "";
        bitfinexPublic.orderbook(symbol, function (err, bitfinexOrderBook) {
            // https://www.bitfinex.net/api/order_book/
            var price, volume, order, orderBook, data;
            orderBook = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err)
                return callback(err, orderBook);
            data = {
                pair: options.pair.replace("BTC", "XBT"),
                asks: [],
                bids: []
            };
            orderBook.data.push(data);
            bitfinexOrderBook.asks.forEach(function (element, index, asks) {
                order = {
                    price: parseFloat(element.price),
                    volume: parseFloat(element.amount)
                };
                orderBook.data[0].asks.push(order);
            });
            bitfinexOrderBook.bids.forEach(function (element, index, bids) {
                order = {
                    price: parseFloat(element.price),
                    volume: parseFloat(element.amount)
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
        var result;
        var err = new Error("Method not implemented");
        result = {
            timestamp: util.timestampNow(),
            error: err && err.message || "",
            data: []
        };
        if (err)
            return callback(err, result);
        return callback(null, result);
    };

    var _movements  = function (symbol, options, callback) {         // same function as native API wrapper, but it returns result according to JSON schema
        bitfinexPrivate.movements(symbol, options, function (err, xMovements) {
            var movement;
            var result = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err)
                return callback(err, result);
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitfinex-getTransactions_MockApiResponse.json", xTransactions);     // only used to create MockApiResponse file for the test unit
            xMovements.forEach(function (element, index, array) {
                var btc, usd, tx;
                result.data.push(
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
                tx = result.data[result.data.length - 1];
                tx.tx_id = element.id.toString();
                tx.datetime = moment.unix(parseFloat(element.timestamp)).utc().format();
                tx.type = element.type.toLowerCase();
                tx.symbol = symbol.toUpperCase().replace("BTC", "XBT");
                tx.amount_base = parseFloat(element.amount);
                tx.add_info = "{'method': '" + element.method + ", 'description': '" + element.description + "'}";
            });
            return callback(null, result);
        });
    };

    var _mytrades  = function (symbol, options, callback) {         // same function as native API wrapper, but it returns result according to JSON schema
        bitfinexPrivate.past_trades(symbol, options, function (err, xTransactions) {
            var trade;
            var result = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err)
                return callback(err, result);
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitfinex-getTransactions_MockApiResponse.json", xTransactions);     // only used to create MockApiResponse file for the test unit
            xTransactions.forEach(function (element, index, array) {
                var btc, usd, tx;
                result.data.push(
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
                tx = result.data[result.data.length - 1];
                tx.tx_id = element.tid.toString();
                tx.datetime = moment.unix(parseFloat(element.timestamp)).utc().format();
                tx.type = element.type.toLowerCase();
                tx.symbol = symbol.toUpperCase().replace("BTC", "XBT");
                switch (tx.type) {
                    case "sell":
                        tx.amount_base = -parseFloat(element.amount);
                        break;
                    case "buy":
                        tx.amount_base = parseFloat(element.amount);
                        break;
                    default:
                        err = new Error ("Unexpected type: " + JSON.stringify(element));
                        result.data = [];
                        result.error = err.message;
                        return callback(err, result);
                }
                tx.rate = parseFloat(element.price);
                var amount_base = new BigNumber(tx.amount_base);
                var rate = new BigNumber(tx.rate);
                var ROUND_UP = 0, ROUND_DOWN = 1, ROUND_HALF_UP = 4;
                var amount_counter = amount_base.times(rate).round(8, ROUND_HALF_UP).negated();
                tx.amount_counter = amount_counter.toNumber();
                tx.order_id = element.order_id ? element.order_id.toString() : "";
                tx.add_info = "{'exchange': '" + element.exchange + "'}";
                var fee, fee_currencyError = true;
                if (element.fee_currency.replace("BTC", "XBT") === tx.symbol.slice(0,3)) {
                    tx.fee_base = parseFloat(element.fee_amount);
                    fee = new BigNumber(tx.fee_base);
                    tx.fee_counter = 0;
                    tx.amount_base = amount_base.plus(fee).toNumber();
                    fee_currencyError = false;
                }
                if (element.fee_currency.replace("BTC", "XBT") === tx.symbol.slice(3,6)) {
                    tx.fee_base = 0;
                    tx.fee_counter = parseFloat(element.fee_amount);
                    fee = new BigNumber(tx.fee_counter);
                    tx.amount_counter = amount_counter.plus(fee).toNumber();
                    fee_currencyError = false;
                }
                if (fee_currencyError) {
                    err = new Error ("Unexpected fee_currency: " + JSON.stringify(element));
                    result.data = [];
                    result.error = err.message;
                    return callback(err, result);
                }
                var stop = 1;
            });
            return callback(null, result);
        });
    };


    self.getTransactions = function (options, callback) {
        var xSymbol, xOptions, pOptions = {}, err, skip = 0, limit = 0;
	    _.assign(pOptions, options);            // will use pOption in async
        limit = options.hasOwnProperty("limit") ? options.limit : self.properties.dictionary.getTransactions.limit.maximum;
	    pOptions["limit"] = limit;
        var transactions = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };
        var gotTheMovements = false;
        var gotTheTrades = false;
        if (options.type === "trades")
            gotTheMovements = true;
        if (options.type === "movements")
            gotTheTrades = true;
        if (options.hasOwnProperty("skip"))
            skip = options.skip;
        async.series({
                getMovements: function(cb){
	                var currency1, currency2, currencies = [];
	                xOptions = {};
                    if (gotTheMovements)
                        return cb(null, 'skipped');
                    if (pOptions.hasOwnProperty("after"))
                        xOptions["since"] = moment(pOptions.after).format("X");
                    if (pOptions.hasOwnProperty("before"))
                        xOptions["until"] = moment(pOptions.before).format("X");
                    if (pOptions.hasOwnProperty("limit"))
                        xOptions["limit"] = limit + skip;
	                if (pOptions.hasOwnProperty("symbol")) {
		                currency1 = pOptions.symbol.substr(0,3);
		                currency2 = pOptions.symbol.substr(3,3);
		                if (currency1 === currency2)
		                    currency2 = "";
		                self.properties.currencies.forEach(function (element, index, array) {
			                if (element === currency1)
				                currencies.push(currency1);
			                if (element === currency2)
				                currencies.push(currency2);
		                });
	                } else {
		                currencies = self.properties.currencies;
	                }
                    async.eachSeries(currencies, function (currency, callback) {    // get movements for all currencies
                        xSymbol = currency.replace("XBT", "BTC").toLowerCase();
                        _movements (xSymbol, xOptions, function (err, result) {
                            if (err) {
                                transactions.error = err.message;
                            } else {
                                util.extendTransactions(transactions, result);
                            }
                            return callback(err);
                        });
                    }, function (err) {
                        if (err) {
                            transactions.error = err.message;
                            return cb(err, "error");
                        }
                        return cb(null, "done");
                    });
                },
                getMytrades: function(cb){
	                xOptions = {};
                    if (gotTheTrades)
                        return cb(null, 'skipped');
	                if (pOptions.hasOwnProperty("after"))
		                xOptions["timestamp"] = moment(pOptions.after).format("X");
	                if (pOptions.hasOwnProperty("before"))
		                xOptions["until"] = moment(pOptions.before).format("X");
	                if (pOptions.hasOwnProperty("limit"))
		                xOptions["limit_trades"] = limit + skip;
	                var pairs = [];
	                if (pOptions.hasOwnProperty("symbol")) {
		                if (self.properties.pairs.indexOf(pOptions.symbol) > -1)
				                pairs.push(pOptions.symbol);
	                } else {
		                pairs = self.properties.pairs;
	                }
                    async.eachSeries(pairs, function (pair, callback) {    // get movements for all pairs
                        xSymbol = pair.replace("XBT", "BTC").toLowerCase();
                        _mytrades (xSymbol, xOptions, function (err, result) {
                            if (err) {
                                transactions.error = err.message;
                            } else {
                                util.extendTransactions(transactions, result);
                            }
                            return callback(err);
                        });
                    }, function (err) {
                        if (err) {
                            transactions.error = err.message;
                            return cb(err, "error");
                        }
                        return cb(null, "done");
                    });
                }
            },
            function(err, results) {
                var deleteCount;
                if (err)
                    return callback (err, transactions);
                if (skip) {         // remove items over the limit
                    transactions.data.splice(0, skip);
                }
                if (limit && transactions.data.length > limit) {         // remove items over the limit
                    deleteCount = transactions.data.length - limit;
                    transactions.data.splice(limit, deleteCount);
                }
                return callback (null, transactions);
            });

            var done = true;
    };

    self.getBalance = function (options, callback) {
        var result;
        result = {
            timestamp: "",
            error: "",
            data: []
        };
        bitfinexPrivate.wallet_balances(function (err, bitfinexBalance) {
            var data, currency, amount, accountIndex, oneBalance;
            result.timestamp = util.timestampNow();
            if (err) {
                result.error = err.message;
                return callback(err, result);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", bitfinexBalance);     // only used to create MockApiResponse file for the test unit
            bitfinexBalance.forEach(function (oneBitfinexBalance, index, arr) {
                data = {
                    account_id: oneBitfinexBalance.type,
                    total: [],
                    available: []
                };
                currency = oneBitfinexBalance.currency.toUpperCase().replace("BTC", "XBT");
                data.total.push({currency: currency, amount: parseFloat(oneBitfinexBalance.amount)});
                data.available.push({currency: currency, amount: parseFloat(oneBitfinexBalance.available)});

                accountIndex = _.findIndex(result.data, {account_id: data.account_id});
                if (accountIndex > -1) {
                    result.data[accountIndex].total = util.updateBalanceArray(result.data[accountIndex].total, data.total).slice(0);
                    result.data[accountIndex].available = util.updateBalanceArray(result.data[accountIndex].available, data.available).slice(0);
                } else
                    result.data.push(data);
            });
            return callback(null, result);
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

	var lendbook = function (currency, callback) {
		bitfinexPublic.lendbook(currency, function (err, xResult) {
			// https://www.bitfinex.net/api/order_book/
			var price, volume, lend, result, data;
			result = {
				timestamp: util.timestampNow(),
				error: err && err.message || "",
				data: []
			};
			if (err)
				return callback(err, result);
			// require("jsonfile").writeFileSync(__dirname + "/bitfinex-getLendBook_MockApiResponse.json", xResult);     // only used to create MockApiResponse file for the test unit
			data = {
				currency: currency.toUpperCase().replace("BTC", "XBT"),
				asks: [],
				bids: []
			};
			result.data.push(data);
			try {   // parse the result
				xResult.asks.forEach(function (element, index, asks) {
					var frr;
					if (typeof element.frr !== "string")
							throw "Invalid frr returned";
					lend = {
						rate: element.rate,
						amount: element.amount,
						period: element.period,
						created_at: moment.unix(parseFloat(element.timestamp)).utc().format(),
						frr: element.frr.toLowerCase()
					};
					result.data[0].asks.push(lend);
				});
				xResult.bids.forEach(function (element, index, bids) {
					if (typeof element.frr !== "string")
						throw "Invalid frr returned";
					lend = {
						rate: element.rate,
						amount: element.amount,
						period: element.period,
						created_at: moment.unix(parseFloat(element.timestamp)).utc().format(),
						frr: element.frr.toLowerCase()
					};
					result.data[0].bids.push(lend);
				});
			} catch (e) {
				result.error = e.message;
				return 	callback(e, result);
			}
			callback(null, result);
		});
	};

	self.getLendBook = function (options, callback) {
		var currency = options.currency.replace("XBT", "BTC").toLowerCase();
		lendbook(currency, function (err, result) {
			callback(err, result);
		});
	};
}






Bitfinex.prototype.properties = {
    name: "Bitfinex",              // Proper name of the exchange/provider
    slug: "bitfinex",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTrades", "getFee", "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder"],
        notSupported: []
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "XBTUSD"
        },
        {
            pair: "LTCUSD"
        },
        {
            pair: "LTCXBT"
        },
        {
            pair: "DRKUSD"
        },
        {
            pair: "DRKXBT"
        }
    ],
	dictionary: {
		"trades": {
			"limit_trades" : {
				"default": 500
			},
			"type" :{
				"buy": "buy",
				"sell": "sell"
			}
		},
		"movements": {
			"limit": {
				"default": 50,
				"max": 1000
			},
			"type": {
				"buy": "buy",
				"sell": "sell"
			}
		},
		"getTransactions": {
			"limit" : {
				"maximum": 1000
			}
		}
	},
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

module.exports = Bitfinex;
