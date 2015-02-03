"use strict";

var locales = {
    en : {
        "Method not implemented": "Method not implemented",     // cryptox error message
        "ETIMEDOUT": "Timed out",
        "API key not specified" : "API key not specified",      // cryptox error message
        "invalid api key": "Invalid API key",                   // BTC-e API error message
        "invalid parameter: pair" : "Invalid parameter: pair",  // BTC-e API error message
        "Empty pair list": "Empty pair list",                   // BTC-e API error message
    }
}
exports.errors = locales;
