"use strict";

var moment = require("moment");
var BITX = require("bitx");
var _ = require("lodash");
var async = require("async");
var BigNumber = require("bignumber.js");

var util = require("./util"); //custom functions

function Bitx (options) {
    var getOrderList;
	var bitxPublic, bitxPrivate;

    var self = this;
    self["options"] = options;

    bitxPublic = new BITX();
    if (typeof options.key === "string" && typeof options.secret === "string") {
        bitxPrivate = new BITX(options.key, options.secret);
    } else {
        bitxPrivate = bitxPublic;
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
        // TODO: return all tickers when pair parameter is not specidfied
        var ticker, data, bitxPair, bitxPublic;

        bitxPublic = new BITX({pair: options.pair});
        bitxPublic.getTicker(function(err, bitxTicker) {
            // https://api.mybitx.com/api/1/tickers
            // https://api.mybitx.com/api/1/ticker?pair=XBTZAR
            if (err) {
                ticker = {
                    timestamp: util.timestampNow(),
                    error: err.message,
                    data: []
                }
            } else {
                ticker = {
                    timestamp: util.timestamp(bitxTicker.timestamp),
                    error: "",
                    data: []
                };
                data = {
                    pair: options.pair,
                    last: parseFloat(bitxTicker.last_trade),
                    bid: parseFloat(bitxTicker.bid),
                    ask: parseFloat(bitxTicker.ask),
                    volume: parseFloat(bitxTicker.rolling_24_hour_volume)
                };
                ticker.data.push(data);
            }
            callback(err, ticker);
        })
    };

    self.getOrderBook = function (options, callback) {
        var orderBook, data, pair;
        pair = typeof options.pair === "string" && {pair: options.pair} || {pair: "nopair"};
        bitxPublic.getOrderBook(pair, function (err, bitxOrderBook) {
            // https://api.mybitx.com/api/1/orderbook?pair=XBTZAR
            var price, volume, order;
            orderBook = {
                timestamp: util.timestampNow(),
                error: err && err.message || "",
                data: []
            };
            if (err) {
                return callback(err, orderBook);
            }
            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", bitxOrderBook);     // only used to create MockApiResponse file for the test unit
            orderBook.timestamp = util.timestamp(bitxOrderBook.timestamp);
            data = {
                pair: options.pair,
                asks: [],
                bids: []
            };
            orderBook.data.push(data);
            bitxOrderBook.asks.forEach (function (element, index, asks) {
                order = {
                    price: parseFloat(asks[index].price),
                    volume: parseFloat(asks[index].volume)
                };
                orderBook.data[0].asks.push(order);
            });
            bitxOrderBook.bids.forEach (function (element, index, bids) {
                order = {
                    price: parseFloat(bids[index].price),
                    volume: parseFloat(bids[index].volume)
                };
                orderBook.data[0].bids.push(order);
            });
            callback(err, orderBook);
        });
    };

    self.getFee = function (options, callback) {
        var fee, data;
        fee = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };
        data = {
            pair: "",
            maker_fee: self.properties.maker_fee,           // fee is hardcodded and fixed
            taker_fee: self.properties.taker_fee
        };
        fee.data.push(data);
        callback(null, fee);
    };

    self.getBalance = function (options, callback) {
        // TODO: Confirm if "balance" include "available"
        bitxPrivate.getBalance(function (err, xBalance) {
            var balance, data, amount;
            balance = {
                timestamp: util.timestampNow(),
                error: "",
                data: []
            };
            if (err) {
                balance.error = err.message;
                return callback(err, balance);
            }

            // var jf = require("jsonfile"); jf.writeFileSync(__dirname + "/bitstamp-getTransactions_MockApiResponse.json", xBalance);     // only used to create MockApiResponse file for the test unit
            xBalance.balance.forEach(function (element, index, bal) {
                var accountIndex, newAccount, balanceElement;
                balanceElement = {
                    account_id: element.account_id,
                    total: {currency: element.asset, amount: parseFloat(element.balance)},
                    available: {currency: element.asset, amount: parseFloat(element.balance) - parseFloat(element.reserved)}
                };
                accountIndex = _.findIndex(balance.data, {account_id: balanceElement.account_id});

                if (accountIndex > -1) {
                    util.updateBalanceArray(balance.data[accountIndex].total, balanceElement.total);
                    util.updateBalanceArray(balance.data[accountIndex].available, balanceElement.available);
                } else {
                    newAccount = {
                        account_id: balanceElement.account_id,
                        total: [],
                        available: []
                    };
                    newAccount.total.push(balanceElement.total);
                    newAccount.available.push(balanceElement.available);
                    balance.data.push(newAccount);
                }
            });
            callback(err, balance);
        });
    };

	getOrderList = function (options, callback) {
		bitxPrivate.getOrderList(options, function (err, xResult) {
			var transactions = {
				timestamp: util.timestampNow(),
				error: err && err.message || "",
				data: []
			};
			if (err)
				return callback(err, transactions);
			// require("jsonfile").writeFileSync(__dirname + "/bitx-getTransactions_MockApiResponse.json", xResult);     // only used to create MockApiResponse file for the test unit
			require("jsonfile").writeFileSync(__dirname + "/bitx-getTransactions_MockApiResponse.json", xResult);     // only used to create MockApiResponse file for the test unit
			if (xResult.orders === null)
				return callback(null, transactions);        // no transactions
			xResult.orders.forEach(function (element, index, array) {
				var skipOrder, tx, amountBaseBN, amountCounterBN;
				amountBaseBN = new BigNumber(element.base);
				amountCounterBN = new BigNumber(element.counter);
				skipOrder = amountCounterBN.eq(0) && amountBaseBN.eq(0) || element.state !== "COMPLETE";
				if (skipOrder)
					return;
				tx = {
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
				};
				transactions.data.push(tx);
				tx.tx_id = element.order_id;
				tx.datetime = moment(element.creation_timestamp || element.expiration_timestamp).utc().format();
				tx.type = element.type === "ASK" ? "sell" : element.type === "BID" ? "buy" : "unknown order type";
				tx.symbol = element.pair;
				tx.fee_base = parseFloat(element.fee_base);
				tx.fee_counter = parseFloat(element.fee_counter);
				switch (tx.type) {
					case "sell":
						amountBaseBN = amountBaseBN.negated();
						break;
					case "buy":
						amountCounterBN = amountCounterBN.negated();
						break;
					default:
				}
				tx.amount_base = amountBaseBN.minus(element.fee_base).toNumber();
				tx.amount_counter = amountCounterBN.minus(element.fee_counter).toNumber();
				tx.rate = parseFloat(element.limit_price);
				tx.order_id = element.order_id;
				tx.add_info = "{'expiration_timestamp': " + element.expiration_timestamp + ", 'limit_volume': " + element.limit_volume + ", 'state': '" + element.state + "'}'"
			});
			callback(null, transactions);
		});
	};

	var getWithdrawals = function (callback) {
		bitxPrivate.getWithdrawals(function (err, xResult) {
			var transactions = {
				timestamp: util.timestampNow(),
				error: err && err.message || "",
				data: []
			};
			if (err)
				return callback(err, transactions);
			// require("jsonfile").writeFileSync(__dirname + "/bitx-getTransactions_MockApiResponse.json", xResult);     // only used to create MockApiResponse file for the test unit
			if(xResult.withdrawals === null)
				return callback(null, transactions);        // no transactions

			xResult.withdrawals.forEach(function (element, index, array) {
				var skipOrder, tx;
				var amountBn = new BigNumber(element.amount);
				skipOrder = element.status !== "COMPLETED";
				if (skipOrder)
					return;
				tx = {
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
				};
				transactions.data.push(tx);
				tx.tx_id = element.id;
				tx.datetime = moment(element.created_at).utc().format();
				tx.type = "withdrawal";
				tx.symbol = element.type.slice(0,3).toUpperCase().replace("BTC", "XBT");
				tx.fee_base = parseFloat(element.fee);
				tx.amount_base = amountBn.minus(element.fee).negated().toNumber();
				tx.add_info = "{'type': '" + element.type + "'}'";
			});
			callback(null, transactions);
		});
	};

	var getFundingAddress = function (callback) {
		bitxPrivate.getFundingAddress("XBT", function (err, xResult) {
			var transactions = {
				timestamp: util.timestampNow(),
				error: err && err.message || "",
				data: []
			};
			if (err)
				return callback(err, transactions);
			// require("jsonfile").writeFileSync(__dirname + "/bitx-getTransactions_MockApiResponse.json", xResult);     // only used to create MockApiResponse file for the test unit
			var tx = {
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
			};
			transactions.data.push(tx);
			var element = xResult;
			tx.tx_id = element.address;
			tx.datetime = util.timestampNow();
			tx.type = "deposit";
			tx.symbol = element.asset;
			tx.amount_base = parseFloat(element.total_received);
			tx.add_info = "{'total_unconfirmed': '" + element.total_unconfirmed + "'}'";
			callback(null, transactions);
		});
	};

	self.getTransactions = function (options, callback) {
		var xOptions;
		var limit = options.hasOwnProperty("limit") ? options.limit : self.properties.defaults.getTransactions.limit;
		var skip = options.hasOwnProperty("skip") && options.skip || 0;
		var transactions = {
			timestamp: util.timestampNow(),
			error: "",
			data: []
		};
		async.series({
			getFundingAddress: function (cb) {
				if (options.hasOwnProperty("type") && options.type === "trades")
					return cb(null, "skipped");
				getFundingAddress(function (err, result) {
					if (err)
						return cb(err, "error");
					util.extendTransactions(transactions, result);
					return cb(null, "done");
				});
			},
			getMovements: function (cb) {
				if (options.hasOwnProperty("type") && options.type === "trades")
					return cb(null, "skipped");
				getWithdrawals(function (err, result) {
					if (err)
						return cb(err, "error");
					util.extendTransactions(transactions, result);
					return cb(null, "done");
				});
			},
			getOrderList: function (cb) {
				if (options.hasOwnProperty("type") && options.type === "movements")
					return cb(null, "skipped");
				xOptions = {
					pair: options.hasOwnProperty("pair") ? options.pair : ""
				};
				getOrderList(xOptions, function (err, result) {
					if (err)
						return cb(err, "error");
					util.extendTransactions(transactions, result);
					return cb(null, "done");
				});
			}
		},
		function (err, results) {
			if (err) {
				transactions.error = err.message;
				return callback(err, transactions);
			}
			var beforeMoment = options.hasOwnProperty("before") && moment(options.before) || null;
			var afterMoment = options.hasOwnProperty("after") && moment(options.after) || null;
			var drop, txMoment, p = 0;  // points to the current record to check;
			var currency, found;
			while (p < transactions.data.length) {
				drop = false;
				txMoment = moment(transactions.data[p].datetime);
				drop = beforeMoment && txMoment.isAfter(beforeMoment);
				drop = drop || afterMoment && txMoment.isBefore(afterMoment);
				if (!drop && options.hasOwnProperty("symbol")) {
					currency = options.symbol.substr(0,3);
					found = transactions.data[p].symbol.indexOf(currency) > -1;
					currency = options.symbol.substr(3,3);
					found = found || currency !== "" && (transactions.data[p].symbol.indexOf(currency) > -1);
					drop = !found;
				}
				if (drop)
					transactions.data.splice(p, 1);       // drop the record
				else
					p++;                           // or move pointer to next one
			}
			if (skip) {         // remove items over the limit
				transactions.data.splice(0, skip);
			}
			if (limit && transactions.data.length > limit) {         // remove items over the limit
				transactions.data.splice(limit, transactions.data.length - limit);
			}
			return callback(null, transactions);
		});
	}

}

Bitx.prototype.properties = {
    name: "BitX",              // Proper name of the exchange/provider
    slug: "bitx",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        notImplemented: ["getTrades", "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder"],
        notSupported: ["getLendBook", "getActiveOffers", "postOffer", "cancelOffer"]
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        // check on https://api.mybitx.com/api/1/tickers
        {
            pair: "XBTZAR"
        },
        {
            pair: "XBTKES"
        },
        {
            pair: "XBTMYR"
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
    tradeError: "",                  //if not able to trade at this exchange, please set it to an URL explaining the problem
    maker_fee: 0,                      // fee is hardcoded and fixed
    taker_fee: 0.01                      // fee is hardcoded and fixed
};

module.exports = Bitx;
