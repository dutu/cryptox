"use strict";

var moment = require("moment");
var _ = require("lodash");
var BigNumber = require("bignumber.js");



// help functions
var util = {
    replaceKey: function (object, changeKey, toKey) {
        if (object.hasOwnProperty(changeKey)) {
            object[toKey] = object[changeKey];
            delete object[changeKey];
        }
        return object;
    },
    addDefaults: function (method, options) {
        var Cryptox = require("../index.js");
        var cryptox = new Cryptox("bitstamp");
        _.forIn(cryptox.properties.defaults[method], function (value, key) {
            if (!options.hasOwnProperty(key)) {
                options[key] = value;
            }
        });
    },
    updateBalanceArray: function (balance, newItems) {
        // the function takes two arguments
        //  balance, both array of item amounts/prices {"currency": currency, "amount": amount}
        // new items, array of item amounts/prices
        //function returns a new balance array, with item.amount added to corresponding items.
        var newBalance = [];
        var unitIndex, currency, amount, i;
        for (i = 0; i < balance.length; i++)
            if (balance[i].amount != 0)
                newBalance.push({currency: balance[i].currency, amount: balance[i].amount});

        for (i = 0; i < newItems.length; i++) {
            currency = newItems[i].currency;
            amount = newItems[i].amount;
            if (currency && amount) {
                    unitIndex = _.findIndex(newBalance, {"currency": currency}); // check if currecny in newItems is present in the balance
                    if (unitIndex == -1)
                        //if not found, add it
                        newBalance.push(newItems[i]);
                    else {
                        //if already exists add the newItem amount to existing balance
                        var oldAmount, newAmount;
                        oldAmount = BigNumber(newBalance[unitIndex].amount);
                        newAmount = BigNumber(oldAmount).plus(BigNumber(amount));
                        newBalance[unitIndex].amount = newAmount.toNumber();
                    }
            }
        }
        return newBalance;

    },

	tx_isAbove: function (tx, referenceTx) {
		//compare 2 transactions returns -1 if tx1 < th 2, zero or 1 if tx1 > tx2
		var refm = moment (referenceTx.datetime);
		var m = moment (tx.datetime);
		if (m.isAfter(refm))
			return 1;
		if (m.isBefore(refm))
			return -1;
		if (m.isSame(refm))
			return (tx.tx_id.localeCompare(referenceTx.tx_id));
	},

	extendTransactions: function (target, newTransactions) {
        // Merge the content of newTransactions into the target
        // target must be initially sorted. the target result will also be sorted
        var i, p = 0, stop, newTx;
        for (i = 0; i < newTransactions.data.length; i++) {
	        newTx = newTransactions.data[i];
	        // move the pointer up as much as possible
	        stop = false;
	        while (!stop && p > 0) {
		        stop = util.tx_isAbove(newTx, target.data[--p]) < 1;
	        }
	        // move the pointer down as much as possible
	        stop = false;
	        while (!stop && p < target.data.length) {
		        stop = util.tx_isAbove(newTx, target.data[p]) >= 0;
		        if (!stop)
			        p++;
	        }
	        target.data.splice(p, 0, newTransactions.data[i]);     // insert at position p;
        }
    },

// check if two moments are corresponding
  // to the same time
   equals: function(a, b) {
    return !(a < b || a > b)
  },
  msToMin: function(ms) {
    return Math.round(ms / 60 / 1000);
  },
  minToMs: function(min) {
    return min * 60 * 1000;
  },
  toMicro: function(moment) {
    return moment.format('X') * 1000 * 1000;
  },
  intervalsAgo: function(amount) {
    return moment().utc().subtract('minutes', config.EMA.interval * amount);
  },
  secAgo: function(m) {
      var then = moment.unix(m);
      var now =  moment().utc();
      var age = now.diff(then, "seconds");
    return age;
  },
  average: function(list) {
    var total = _.reduce(list, function(m, n) { return m + n }, 0);
    return total / list.length;
  },
  // calculate the average trade price out of a sample of trades.
  // The sample consists of all trades that happened after the treshold.
  calculatePriceSince: function(treshold, trades) {
    var sample = [];
    _.every(trades, function(trade) {
      if(moment.unix(trade.date) < treshold)
        return false;

      var price = parseFloat(trade.price);
      sample.push(price);
      return true;
    });

    return util.average(sample);
  },
  // calculate the average trade price out of a sample of trades.
  // The sample consists of all trades that happened before the treshold.
  calculatePriceTill: function(treshold, trades) {
    var sample = [];
    _.every(trades, function(trade) {
      if(moment.unix(trade.date) > treshold)
        return false;

      var price = parseFloat(trade.price);
      sample.push(price);
      return true;
    });

    return util.average(sample);
  },
  calculateTimespan: function(a, b) {
    if(a < b)
      return b.diff(a);
    else
      return a.diff(b);
  },
  defer: function(fn) {
    return function(args) {
      var args = _.toArray(arguments);
      return _.defer(function() { fn.apply(this, args) });
    }
  },
  logVersion: function() {
    console.log('xMon version:', 'v' + util.getVersion());
    console.log('Nodejs version:', process.version);
  },
  die: function(m) {
    if(m) {
      console.log('\n\nxMon encountered an error and can\'t continue');
      console.log('\nMeta debug info:\n');
      console.log('\nError:\n');
      console.log(m, '\n\n');
    }
    process.kill();
  },
  adjTimestamp: function (timestamp){
/*
    // adjust the length of timestamp based on length of time now
    var DateNow = new Date();
    n = DateNow.getTime().toString().length - timestamp.toString().length;
    r = timestamp * Math.pow(10, n);
*/
      var n = moment().format("X").toString().length - timestamp.toString().length;
      return timestamp * Math.pow(10, n);
    },
    timestamp2string: function (timestamp){
    //format timestamp to string
        var time = moment.unix(timestamp);
    //    return time.format('YYYY-MM-DD HH:mm:ss ZZ');
        return time.toISOString();

    },
    timestampNow: function(){
        return moment().utc().format();
    },
    timestamp: function (timestamp){
        var timestampUnix, time;
        if (typeof timestamp !== "string" && typeof timestamp !== "number")
            return "";
        timestampUnix = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;

        timestampUnix = timestampUnix > 9999999999 ? timestampUnix / 1000 : timestampUnix; // if represented in milliseconds
        time = moment.unix(timestampUnix);
        return time.utc().format();
    },
    removeErrorStr: function (errorMessage){       // remove "Error: " or "Error:", returns resulting string
        if (typeof errorMessage === "string") {
            errorMessage.replace("Error: ", "");
            errorMessage.replace("Error:", "");
        }
        return errorMessage;
    }
};
module.exports = util;
