"use strict";

var locales = {
    en : {
        "Method not implemented": "Method not implemented",     // cryptox
        "Method not supported": "Method not supported",         // cryptox
        "ETIMEDOUT": "Timed out",
        "API key not specified" : "API key not specified",      // cryptox
        "invalid api key": "Invalid API key",                   // BTC-e API
        "BitX error 401: Unauthorized\n": "Invalid API key",    // BitX API
        "Must provide API key and secret to use the trade API.": "API key not specified", //BTC-e API
        "invalid parameter: pair" : "Invalid currency pair",    // BTC-e API
        "Invalid currency pair.": "Invalid currency pair",      // BitX API
        "Invalid currency pair": "Invalid currency pair",       // cryptox/lib/oxr.js, cryptox/lib/bitfinex.js
        "Unknown symbol": "Invalid currency pair",              // bitfinex npm module
        "Empty pair list": "Empty pair list",                   // BTC-e API
        "Invalid currency code.": "Invalid currency code",      // BitX API
    }
}
exports.errors = locales;
