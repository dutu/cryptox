cryptox
=======
[![Build Status](https://travis-ci.org/dutu/cryptox.svg)](https://travis-ci.org/dutu/cryptox/) ![Dependencies Status](https://david-dm.org/dutu/cryptox.svg)


**cryptox** is a node.js wrapper for REST API for multiple crypto currency exchanges.

**cryptox** manages API communication with different exchanges and  provides common methods for all exchanges. Differences between the different API's are abstracted away.


### Contents
* [Install](#install)
* [Use](#use)
* [Supported Exchanges and Implemented Methods](#supported-exchanges-and-implemented-methods)
* [ChangeLog](#changelog)
* [Documentation](#documentation)
* [FAQ](#faq)
* [License](#license) 



# Install #

    npm install cryptox



# Use #

```js
var Cryptox = require("cryptox");
var account = new Cryptox("btce", {key: "your_key", secret: "your_secret"});
	
account.getOpenOrders({pair: "LTCUSD"}, function (err, openOrders) {
    if (!err)
	    console.log(openOrders);
});
```

Example result:
```js
{
    "timestamp": "2015-02-03T00:03:27+00:00",
    "error": "",
    "data": [
        {
            "order_id": "563489985",
            "pair": "LTCUSD",
            "type": "buy",
            "amount": "1",
            "rate": "0.1",
            "status": "0",
            "created_at": "2015-02-01T19:23:15+00:00"
        },
        {
            "order_id": "563612426",
            "pair": "LTCUSD",
            "type": "buy",
            "amount": "2",
            "rate": "0.5",
            "status": "0",
            "created_at": "2015-02-01T20:59:53+00:00"
        }        
    ]
}
```



# Supported Exchanges and Implemented methods #
*if you are interested in extending cryptox for different exchange or a method not yet implemented, check out the document [exchanges.md](exchanges.md)*

|                                                            |Bitfinex|Bitstamp      |BitX|BTC-e|CEX.io|Coinbase|Poloniex|OXR <sup>[1]</sup>|
|   ---                                                      |  :-:   |  :-:         |:-: | :-: | :-:  |   :-:  |  :-:   |    :-:           |
|[getRate](docs/api_documentation.md#getrate)                |   FI   |   FI         | FI | FI  |      |   FI   |   FI   |     FI           | 
|[getTicker](docs/api_documentation.md#getticker)            |   FI   |   FI         | FI | FI  |      |   FI   |   FI   |      —           |
|[getOrderBook](docs/api_documentation.md#getorderbook)      |   FI   |   FI         | FI | FI  |      |   FI   |   FI   |      —           |
|[getTrades](docs/api_documentation.md#gettrades)            |        |              |    |     |      |   FI   |        |      —           |
|[getFee](docs/api_documentation.md#getfee)                  |        |   FI         | FI | FI  |      |        |        |      —           |
|[getTransactions](docs/api_documentation.md#gettransactions)|   FI   |   FI         | FI |     |      |        |        |      —           |
|[getBalance](docs/api_documentation.md#getbalance)          |   FI   |   FI         | FI |     |      |   FI   |   FI   |      —           |
|[getOpenOrders](docs/api_documentation.md#getopenorders)    |        |              | FI | FI  |      |        |        |      —           |
|[postSellOrder](docs/api_documentation.md#postsellorder)    |        |              |    |     |      |        |        |      —           |
|[postBuyOrder](docs/api_documentation.md#postbuyorder)      |        |              |    |     |      |        |        |      —           |
|[cancelOrder](docs/api_documentation.md#cancelorder)        |        |              |    |     |      |        |        |      —           |
|[getLendBook](docs/api_documentation.md#getlendbook)        |   FI   |    —         | —  |  —  |  —   |   —    |        |      —           |

> **FI** = Fully Implemented  
> **FR** = Fully Implemented, but restrictions apply; refer to notes below (if any)  
> **PI** = Partially Implemented; refer to notes below (if any)  
> **—** = Not Supported    

><sup>[1]</sup> OXR ([Open Exchange Rates](https://openexchangerates.org/)) is not a crypto exchange, however it provides exchange rates for world fiat currencies     



# ChangeLog

> cryptox module adheres to [Semantic Versioning] (http://semver.org/) for versioning: MAJOR.MINOR.PATCH.  
> 1. MAJOR version increments when non-backwards compatible API changes are introduced  
> 2. MINOR version increments when functionality in a backwards-compatible manner are introduced  
> 3. PATCH version increments when backwards-compatible bug fixes are made  


See detailed [ChangeLog](CHANGELOG.md)


# Documentation

See [API documentation](docs/api_documentation.md)

# FAQ

See [FAQ](docs/faq.md)

# License #

[MIT](LICENSE)