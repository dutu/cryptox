"use strict";

var moment = require("moment");
var _ = require("lodash");
var async = require("async");
var BITSTAMP = require('./api_wrappers/bitstamp');      // remove dependency on bitstamp NPM module

var util = require("./util"); //custom functions

function Bitstamp (options) {
    var bitstampPublic, bitstampPrivate;
    var self = this;
    self["options"] = options;

    bitstampPublic = new BITSTAMP();
    if (typeof options["key"] === "string" && typeof options["secret"] === "string" && typeof options.username === "string") {
        bitstampPrivate = new BITSTAMP(options.key, options.secret, options.username);
    } else {
        bitstampPrivate = bitstampPublic;
    }

    var checkErr = function (err, result) {     // arguments are the result from BITSTAMP module,
                                                // returns the error (as Error object type) or null id no error
        if (err instanceof Error)
            return err;
        if (typeof err === "string")
            return new Error(err);
        if (result && typeof result.error === "string")
            return new Error(result.error);
    };

	var user_transactions = function (options, callback) {             // same function as native API wrapper, but it returns result normalized according to JSON schema
		bitstampPrivate.user_transactions(options, function (err, xTransactions) {
			var transactions, amount;
			transactions = {
				timestamp: util.timestampNow(),
				error: err && err.message || "",
				data: []
			};
			if (err) {
				return callback(err, transactions);
			}
			// var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", xTransactions);     // only used to create MockApiResponse file for the test unit
			xTransactions.forEach(function (element, index, array) {
				var btc, usd, tx;
				transactions.data.push(
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
				tx = transactions.data[transactions.data.length - 1];
				tx.tx_id = element.id.toString();
				tx.datetime = moment(element.datetime + " Z").utc().format();
				btc  = parseFloat(element.btc);
				usd  = parseFloat(element.usd);
				switch (element.type) {
					case 0:     // deposit
						tx.type = "deposit";
						if (btc > 0) {
							tx.symbol = "XBT";
							tx.amount_base = btc;
						}
						if (usd > 0) {
							tx.symbol = "USD";
							tx.amount_base = usd;
						}
						break;
					case 1:     // withdrawal
						tx.type = "withdrawal";
						if (btc < 0) {
							tx.symbol = "XBT";
							tx.amount_base = btc;
						}
						if (usd < 0) {
							tx.symbol = "USD";
							tx.amount_base = usd;
						}
						break;
					case 2:     // market trade
						tx.type = element.btc < 0 ? "sell" : "buy";
						tx.symbol = "XBTUSD";
						tx.amount_base = btc;
						tx.amount_counter = usd;
						tx.rate = parseFloat(element.btc_usd);
						tx.order_id = element.order_id ? element.order_id.toString() : "";
						break;
					default:
				}
				tx.fee_counter = parseFloat(element.fee);
			});
			callback(null, transactions);
		});
	};

    self.getRate = function (options, callback) {
        self.getTicker(options, function(err, result) {
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
            rate.timestamp = result.timestamp;
            data = {
                pair: result.data[0].pair,
                rate: result.data[0].last
            };
            rate.data.push(data);
            callback(err, rate);
        });
    };

    self.getTicker = function (options, callback) {
        // https://www.bitstamp.net/api/ticker/
        var ticker, data;
        bitstampPublic.ticker(function(xErr, bitstampTicker) {
            var err = checkErr(xErr, bitstampTicker);
            ticker = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err)
                return callback(err, ticker);

            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", bitstampTicker);     // only used to create MockApiResponse file for the test unit
            ticker.timestamp = util.timestamp(bitstampTicker.timestamp);
            data = {
                pair: self.properties.instruments[0].pair,
                last: parseFloat(bitstampTicker.last),
                bid: parseFloat(bitstampTicker.bid),
                ask: parseFloat(bitstampTicker.ask),
                volume: parseFloat(bitstampTicker.volume),
                high: parseFloat(bitstampTicker.high),
                low: parseFloat(bitstampTicker.low),
                vwap: parseFloat(bitstampTicker.vwap)
            };
            ticker.data.push(data);
            callback(null, ticker);
        })
    };

    self.getOrderBook = function (options, callback) {
        var orderBook, data;
        bitstampPublic.order_book(function (xErr, bitstampOrderBook) {
            // https://www.bitstamp.net/api/order_book/
            var price, volume, order;
            var err = checkErr(xErr, bitstampOrderBook);
            orderBook = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, orderBook);
            }
            orderBook.timestamp = util.timestamp(bitstampOrderBook.timestamp);
            data = {
                pair: self.properties.instruments[0].pair,
                asks: [],
                bids: []
            };
            orderBook.data.push(data);
            bitstampOrderBook.asks.forEach(function (element, index, asks) {
                order = {
                    price: parseFloat(asks[index][0]),
                    volume: parseFloat(asks[index][1])
                };
                orderBook.data[0].asks.push(order);
            });
            bitstampOrderBook.bids.forEach(function (element, index, bids) {
                order = {
                    price: parseFloat(bids[index][0]),
                    volume: parseFloat(bids[index][1])
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
        bitstampPrivate.balance(function (xErr, bitstampBalance) {
            var fee, data;
            var err = checkErr(xErr, bitstampBalance);
            fee = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, fee);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", bitstampBalance);     // only used to create MockApiResponse file for the test unit
            data = {
                pair: "",
                maker_fee: parseFloat(bitstampBalance.fee) / 100, // note that Bitstamp native API call returns 0.2 for 0.2%
                taker_fee: parseFloat(bitstampBalance.fee) / 100
            };
            fee.data.push(data);
            callback(null, fee);
        });
    };

    self.getTransactions = function (options, callback) {
        var limit, skip, skippedCount, beforeMoment, afterMoment, txMoment, fetchMore, manualFilter;
	    var transactions = {
		    timestamp: util.timestampNow(),
		    error: "",
		    data: []
	    };

        util.addDefaults("getTransactions", options);

	    // store for later manipulation of result data
	    limit = options.limit;
	    skip = options.hasOwnProperty("skip") && options.skip || 0;
	    beforeMoment = options.hasOwnProperty("before") && moment(options.before) || null;
	    afterMoment = options.hasOwnProperty("after") && moment(options.after) || null;

	    //set xOptions to call the function
	    var xOptions = {
		    offset: skip,
		    limit: options.limit,
		    sort: options.sort
	    };
	    if (options.hasOwnProperty("before") || options.hasOwnProperty("after") || options.hasOwnProperty("type")) {
		    // if we will aplly manual filter, don't skip anything and fetch maximum
		    xOptions.limit = self.properties.dictionary.getTransactions.limit.maximum;
		    xOptions.offset = 0;
		    manualFilter = true;
	    }
	    async.doWhilst(
		    function (cb) {
			    user_transactions(xOptions, function (err, result) {
				    if (err)
				        return cb(err);
				    fetchMore = !(xOptions.limit < self.properties.dictionary.getTransactions.limit.maximum);     // if we fetched less than maximum we don't need to fetchMore for sure
				    fetchMore = fetchMore  && !(result.data.length < xOptions.limit);     // if fetched below the xOptions.limit, we can't fetch more (we fetched all)
				    // drop records before, after and skip
				    var drop, p = 0;  // points to the current record to check;
				    while (p < result.data.length) {
					    drop = false;
					    txMoment = moment(result.data[p].datetime);
					    drop = beforeMoment && txMoment.isAfter(beforeMoment);
					    if (!drop && options.hasOwnProperty("type")) {
						    drop = (options.type === "movements") && (["buy", "sell"].indexOf(result.data[p].type) > -1);
						    drop = drop ||  (options.type === "trades") && (["deposit", "withdrawal"].indexOf(result.data[p].type) > -1);
					    }
					    if (!drop && afterMoment && txMoment.isBefore(afterMoment)) {
						    fetchMore = false;
						    drop = true;
					    }
					    if (!drop && options.hasOwnProperty("symbol")) {
						    var currency, found;
						    currency = options.symbol.substr(0,3);
						    found = result.data[p].symbol.indexOf(currency) > -1;
						    currency = options.symbol.substr(3,3);
						    found = found || currency !== "" && (result.data[p].symbol.indexOf(currency) > -1);
						    drop = !found;
					    }
					    if (drop)
						    result.data.splice(p, 1);       // drop the record
					    else
						    p++;                           // or move pointer to next one
				    }
				    util.extendTransactions(transactions, result);
				    fetchMore = fetchMore && transactions.data.length < limit + skip;
				    cb(null);
			    });
	        },
		    function () {
			    if (fetchMore)
			        xOptions.offset += xOptions.limit;
			    return fetchMore;
		    },
		    function (err) {
			    if (err) {
				    transactions.error = err.message;
				    return callback(err, transactions);
			    }
			    if (manualFilter && skip)
				    transactions.data.splice(0, skip);
			    transactions.data.splice(limit, transactions.data.length - limit);
			    callback(null, transactions);
	        });
    };

    self.getBalance = function (options, callback) {
        bitstampPrivate.balance(function (err, bitstampBalance) {
            var balance, data, amount;
            balance = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, balance);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", bitstampBalance);     // only used to create MockApiResponse file for the test unit
            data = {
                total: [],
                available: []
            };
            amount = parseFloat(bitstampBalance.btc_balance);
            if (amount)
                data.total.push({currency: "XBT", amount: amount});
            amount = parseFloat(bitstampBalance.usd_balance);
            if (bitstampBalance.usd_balance)
                data.total.push({currency: "USD", amount: amount});
            amount = parseFloat(bitstampBalance.btc_available);
            if (amount)
                data.available.push({currency: "XBT", amount: amount});
            amount = parseFloat(bitstampBalance.usd_available);
            if (amount)
                data.available.push({currency: "USD", amount: amount});
            balance.data.push(data);
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
    };
}

Bitstamp.prototype.properties = {
    name: "Bitstamp",              // Proper name of the exchange/provider
    slug: "bitstamp",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTrades", "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder"],
        notSupported: ["getLendBook", "getActiveOffers", "postOffer", "cancelOffer"]
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        {
            pair: "XBTUSD"
        }
    ],
	dictionary: {
		"withdrawal_requests": {
			type: {
				"0": "SEPA",
				"1": "Bitcoin",
				"2": "WIRE transfer"
			},
			status: {
				"0": "open",
				"1": "in process",
				"2": "finished",
				"3": "canceled",
				"4": "failed"
			}
		},
		"sell": {
			"type": {
				"0": "buy",
				"1": "sell"
			}
		},
		"buy": {
			"type" :{
				"0": "buy",
				"1": "sell"
			}
		},
		"open_orders": {
			"type" :{
				"0": "buy",
				"1": "sell"
			}
		},
		"user_transactions": {
			"offset" : {
				"default": 0
			},
			"limit" : {
				"default": 100,
				"maximum": 1000
			},
			"sort" : {
				"desc": "desc",
				"asc": "asc",
				"default": "desc"
			},
			"type" :{
				"0": "deposit",
				"1": "withdrawal",
				"2": "trade"
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
        requires: ["key", "secret", "username"]
    },
    marketOrder: false,             // does it support market orders?
    infinityOrder: false,           // does it supports infinity orders?
                                    // (which means that it will accept orders bigger then the current balance and order at the full balance instead)
    monitorError: "",               //if not able to monitor this exchange, please set it to an URL explaining the problem
    tradeError: ""                  //if not able to trade at this exchange, please set it to an URL explaining the problem
};

module.exports = Bitstamp;
