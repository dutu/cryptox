"use strict";

var locales = {
    en : {
        "Method not implemented": "Method not implemented",     // cryptox
        "Method not supported": "Method not supported",         // cryptox
        "ETIMEDOUT": "Timed out",
        "API key not specified" : "API key not specified",      // cryptox
        "invalid api key": "Invalid API key",                   // BTC-e API
        "BitX error 401: Unauthorized\n": "Invalid API key",    // BitX API
        "invalid parameter: pair" : "Invalid currency pair",    // BTC-e API
        "Invalid currency pair.": "Invalid currency pair",      // BitX API
        "Invalid currency pair": "Invalid currency pair",       // cryptox/oxr.js
        "Empty pair list": "Empty pair list",                   // BTC-e API
        "Invalid currency code.": "Invalid currency code",      // BitX API
    }
}
exports.errors = locales;
