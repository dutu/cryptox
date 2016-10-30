'use strict';

const moment = require("moment");
const BITX = require("bitx");
const _ = require("lodash");
const async = require("async");
const BigNumber = require("bignumber.js");

const util = require("./util"); //custom functions

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

    Object.getOwnPropertyNames(Object.getPrototypeOf(bitxPrivate)).forEach(prop => {
        if (typeof  bitxPrivate[prop] === 'function' && prop !== 'constructor') {
            self[prop] = bitxPrivate[prop];
        }
    });

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

	function formatCurrencyPair(pair) {
	    if (typeof pair !== "string") {
            return pair;
        }
		let currencies = pair.split('_');
		return `${currencies[0].replace(/btc/i, 'XBT').toUpperCase()}${currencies[1].replace(/btc/i, 'XBT').toUpperCase()}`
	}

    self.getTicker = function (options, callback) {
        // TODO: return all tickers when pair parameter is not specidfied
        let ticker, data, bitxPair, bitxPublic;

        let pair = formatCurrencyPair(options.pair);
        bitxPublic = new BITX({pair: pair});
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
                    last: bitxTicker.last_trade,
                    bid: bitxTicker.bid,
                    ask: bitxTicker.ask,
                    volume: bitxTicker.rolling_24_hour_volume
                };
                ticker.data.push(data);
            }
            callback(err, ticker);
        })
    };

    self.getOrderBook = function (options, callback) {
        let orderBook;
        let pair = formatCurrencyPair(options.pair);
        bitxPublic.getOrderBook(pair, function (err, bitxOrderBook) {
            // https://api.mybitx.com/api/1/orderbook?pair=XBTZAR
            let order;
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
            let data = {
                pair: options.pair,
                asks: [],
                bids: []
            };
            orderBook.data.push(data);
            bitxOrderBook.asks.forEach (function (element, index, asks) {
                order = {
                    price: asks[index].price,
                    volume: asks[index].volume
                };
                orderBook.data[0].asks.push(order);
            });
            bitxOrderBook.bids.forEach (function (element, index, bids) {
                order = {
                    price: bids[index].price,
                    volume: bids[index].volume,
                };
                orderBook.data[0].bids.push(order);
            });
            callback(err, orderBook);
        });
    };

    self.getFee = function (options, callback) {
        let fee = {
            timestamp: util.timestampNow(),
            error: "",
            data: []
        };
        let data = {
            pair: options.pair,
            maker_fee: self.properties.maker_fee.toString(),           // fee is hardcodded and fixed
            taker_fee: self.properties.taker_fee.toString()
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

    self.getMarginPositions = function (options, callback) {
        let err = new Error("Method not supported");
        let result = {
            timestamp: util.timestampNow(),
            error: err && err.message || "",
            data: []
        };
        if (err)
            return callback(err, result);
        return callback(null, result);
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
					amount_base: '0',
					amount_counter: '0',
					rate: '0',
					fee_base: '0',
					fee_counter: '0',
					order_id: "",
					add_info: ""
				};
				transactions.data.push(tx);
				tx.tx_id = element.order_id;
				tx.datetime = moment(element.creation_timestamp || element.expiration_timestamp).utc().format();
				tx.type = element.type === "ASK" ? "sell" : element.type === "BID" ? "buy" : "unknown order type";
				tx.symbol = element.pair;
				tx.fee_base = element.fee_base;
				tx.fee_counter = element.fee_counter;
				switch (tx.type) {
					case "sell":
						amountBaseBN = amountBaseBN.negated();
						break;
					case "buy":
						amountCounterBN = amountCounterBN.negated();
						break;
					default:
				}
				tx.amount_base = amountBaseBN.minus(element.fee_base).toString();
				tx.amount_counter = amountCounterBN.minus(element.fee_counter).toString();
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
					amount_base: '0',
					amount_counter: '0',
					rate: '0',
					fee_base: '0',
					fee_counter: '0',
					order_id: "",
					add_info: ""
				};
				transactions.data.push(tx);
				tx.tx_id = element.id;
				tx.datetime = moment(element.created_at).utc().format();
				tx.type = "withdrawal";
				tx.symbol = element.type.slice(0,3).toUpperCase().replace("BTC", "XBT");
				tx.fee_base = element.fee;
				tx.amount_base = amountBn.minus(element.fee).negated().toString();
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
				amount_base: '0',
				amount_counter: '0',
				rate: '0',
				fee_base: '0',
				fee_counter: '0',
				order_id: "",
				add_info: ""
			};
			transactions.data.push(tx);
			let element = xResult;
			tx.tx_id = element.address;
			tx.datetime = util.timestampNow();
			tx.type = "deposit";
			tx.symbol = element.asset;
			tx.amount_base = element.total_received;
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
	};

	self.getOpenOrders = function (options, callback) {
		let openOrders = {
			timestamp: util.timestampNow(),
			error: "",
			data: []
		};
        let pair = formatCurrencyPair(options.pair);
        let xOptions = _.clone(options);
        xOptions.pair = pair;
        xOptions.state = 'PENDING';
		bitxPrivate.getOrderList(xOptions, function (err, xResult) {
			if (err) {
				openOrders.error = err.message;
				return callback(err, openOrders);
			}
			// var jf = require("jsonfile").writeFileSync(__dirname + "/bitx-getOpenOrders_MockApiResponse.json", xResult);     // only used to create MockApiResponse file for the test unit

			if (xResult.orders) {
				xResult.orders.forEach(function (element, index, array) {
					let newOrder = {
						order_id: element.order_id,
						pair: `${element.pair.substr(0, 3)}_${element.pair.substr(3, 3)}`,
						type: "",               // 'buy'
						amount: element.limit_volume,           // 2.85811
						rate: element.limit_price,               // 444.064
						margin: false,
						status: element.state,           // 0
						created_at: util.timestamp(element.creation_timestamp)      // 1396619879
					};
					switch (element.type) {
						case "ASK":
							newOrder.type = "sell";
							break;
						case "BID":
							newOrder.type = "buy";
							break;
						default :
							newOrder.type = element.type;
					}
					openOrders.data.push(newOrder);
				});
			}
			callback(null, openOrders);
		});
	};
}

Bitx.prototype.properties = {
    name: "BitX",              // Proper name of the exchange/provider
    slug: "bitx",               // slug name of the exchange. Needs to be the same as the .js filename
    methods: {
        implemented: ["getRate", "getTicker", "getOrderBook", "getFee", "getTransactions", "getBalance", "getOpenOrders"],
        notSupported: ["getLendBook", "getActiveOffers", "postOffer", "cancelOffer", 'getMarginPositions']
    },
    instruments: [                  // all allowed currency/asset combinatinos (pairs) that form a market
        // check on https://api.mybitx.com/api/1/tickers
        {
            pair: "XBT_ZAR"
        },
        {
            pair: "XBT_KES"
        },
        {
            pair: "XBT_MYR"
        }
    ],
	dictionary: {
		"getTransactions": {
			"limit" : {
				"maximum": 100
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
    tradeError: "",                  //if not able to trade at this exchange, please set it to an URL explaining the problem
    maker_fee: 0,                      // fee is hardcoded and fixed
    taker_fee: 0.01                      // fee is hardcoded and fixed
};

module.exports = Bitx;
