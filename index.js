var lang = "en";
var errMsg = require("./lib/errors_" +lang);

function Cryptox (exchangeSlug, options) {
    var self = this;
    var Exchange = require('./lib/' + exchangeSlug);
    self.properties = Exchange.prototype.properties;

    var exchange;
    // TODO: Check exchangeSlug?
    exchange = new Exchange(options);

    self.getTicker = function (options, callback){
        exchange.getTicker(options, function (err, ticker){
            callback(err, ticker);
        });
    }

    self.getFee = function (options, callback){
        exchange.getFee(options, function (err, fee){
            callback(err, fee);
        });
    }
}
module.exports = Cryptox;
