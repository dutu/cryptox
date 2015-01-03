
var moment = require('moment');
var _ = require('lodash');
var BigNumber = require('bignumber.js');


// help functions
var util = {
    updateBalanceArray: function (balance, newItems) {
        // the function takes two arguments
        //  balance, array of item amounts/prices {"unit": unit, "amount": amount}
        // new items, array of item amounts/prices
        //function returns a new balance array, with item.amount added to corresponding items.
        var newBalance = [];
        var unitIndex, unit, amount, i;
        for (i = 0; i < balance.length; i++)
            if (balance[i].amount != 0)
                newBalance.push({unit: balance[i].unit, amount: balance[i].amount});

        for (i = 0; i < newItems.length; i++) {
            unit = newItems[i].unit;
            amount = newItems[i].amount;
            if (unit && amount) {
                    unitIndex = _.findIndex(newBalance, {"unit": unit}); // check if unit in newItems is present in the balance
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
      return timestamp * Math.pow(10, n);;
  },
  timestamp2string: function (timestamp){
    //format timestamp to string
      var time = moment.unix(timestamp);
//    return time.format('YYYY-MM-DD HH:mm:ss ZZ');
      return time.toISOString();

  }
};
module.exports = util;