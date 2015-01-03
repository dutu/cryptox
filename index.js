/**
 * Created by dutu on 2015-01-03.
 */

var BITSTAMP = require('bitstamp');
var util = require('lib/util.js'); //custom functions


function Cryptox (exchange, apiKey, secret, user_id) {
    var self = this;
    self.me = "Bitstamp";
    self.config = {
        fee: 0.005
    };
    exchange = "bitstamp";
    var bitstampPublic = new BITSTAMP();
    var bitstampPrivate;
    if (typeof apiKey === "string" && typeof secret === "string" && typeof user_id === "string" ) {
        bitstampPrivate = new BITSTAMP(apiKey, secrrt. user_id);
    } else {
        bitstampPrivate = null;
    }

    self.getTicker = function(pair, callback) {
        var pair = 'BTC_USD';
        bitstampPublic.ticker(function(err, bitstampTicker) {
            // https://btc-e.com/apiv1/2/btc_usd/ticker
            var newTicker = {
                exchange: exchange,
                pair: pair,
                result: err && err.message || "success"
            }
            if (!err) {
                newTicker["ticker"] = {
                    timestamp: util.timestamp2string(bitstampTicker.timestamp),
                    timestring: util.timestamp2string(bitstampTicker.timestamp),
                    last: parseFloat(bitstampTicker.last),
                    bid: parseFloat(bitstampTicker.bid),
                    ask: parseFloat(bitstampTicker.ask),
                    volume: parseFloat(bitstampTicker.volume)
                }
            }
            callback(newTicker);
        })
    };

    self.getOrderBook = function(pair, callback) {
        var pair = 'BTC_USD';
        bitstampPublic.order_book(function (err, bitstampOrderBook) {
            // https://btc-e.com/apiv1/2/btc_usd/depth
            var newOrderBook = {
                exchange: exchange,
                pair: pair,
                result: err && err.message || "success"
            }
            if (!err) {
                newOrderBook["orderbook"] = {
                    timestamp: util.timestamp2string(bitstampOrderBook.timestamp),
                    timestring: util.timestamp2string(bitstampOrderBook.timestamp),
                    asks: [],
                    bids: []
                }
            }
            bitstampOrderBook.asks.forEach(function (element, index, asks) {
                var price = parseFloat(asks[index][0]);
                var volume = parseFloat(asks[index][1]);
                var order = new Array(price, volume);
                newOrderBook.asks.push(order);
            });
            bitstampOrderBook.bids.forEach(function (element, index, asks) {
                var price = parseFloat(asks[index][0]);
                var volume = parseFloat(asks[index][1]);
                var order = new Array(price, volume);
                newOrderBook.bids.push(order);
            });
            callback(newOrderBook);
        });
    }
}

module.exports = Cryptox;