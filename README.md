cryptox
=======

**cryptox** is a node.js wrapper for REST API for multiple crypto currency exchanges.

**cryptox** manages API communication with different exchanges and  provides common methods for all exchanges. Differences between the different API's are abstracted away.


### Contents
* [Install](#install)
* [Example](#example)
* [Supported Exchanges and Implemented Methods](#supportedexchangesandimplementedmethods)
* [Changelog](#changelog)
* [Documentation](#documentation)
    * [Constructor](#constructor)
    * [Methods](#methods)
        * [getTicker](#getticker)
        * [getOrderBook](#getorderbook)
        * [getTrades](#gettrades)
        * [getFee](#getfee)
        * [getTransactions](#gettransactions)
        * [getBalance](#getbalance)
        * [getOpenOrders](#getopenorders)
        * [postSellOrder](#postsellorder)
        * [postBuyOrder](#postbuyorder)
        * [cancelOrder](#cancelorder)
* [License](#license) 



# Install #

    npm install cryptox



# Example #

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
            "amount": 1,
            "rate": 0.1,
            "status": 0,
            "created_at": "2015-02-01T19:23:15+00:00"
        },
        {
            "order_id": "563612426",
            "pair": "LTCUSD",
            "type": "buy",
            "amount": 2,
            "rate": 0.5,
            "status": 0,
            "created_at": "2015-02-01T20:59:53+00:00"
        }        
    ]
}
```



# Supported Exchanges and Implemented methods #
*if you are interested in extending cryptox for different exchange or a method not yet implemented, check out the document [exchanges.md](exchanges.md)*

                                   |Bitfinex|Bitstamp      |BitX|BTC-e|CEX.io|OXR<sup>1</sup>| 
   ---                             |  :-:   |  :-:         |:-: | :-: | :-:  |    :-:        |
[getTicker](#getticker)            |        |   FI         | FI | FI  |      |FI<sup>2</sup> |
[getOrderBook](#getorderbook)      |        |FI<sup> </sup>| FI | FI  |      |      —        |
[getTrades](#gettrades)            |        |              |    |     |      |      —        |
[getFee](#getfee)                  |        |              |    | FI  |      |      —        |
[getTransactions](#gettransactions)|        |              |    |     |      |      —        |
[getBalance](#getbalance)          |        |              |    |     |      |      —        |
[getOpenOrders](#getopenorders)    |        |              |    | FI  |      |      —        |
[postSellOrder](#postsellorder)    |        |              |    |     |      |      —        |
[postBuyOrder](#postbuyorder)      |        |              |    |     |      |      —        |
[cancelOrder](#cancelorder)        |        |              |    |     |      |      —        |


>**FI** = Fully Implemented
>**FR** = Fully Implemented, but restrictions apply (refer to notes below)
>**PI** = Partially Implemented (refer to notes below)
>**—** = Not Supported

><sup>1</sup> OXR ([Open Exchange Rates](https://openexchangerates.org/)) is not a crypto exchange, however it provides exchange rates for world fiat curencies 
><sup>2</sup> returns the exchange rate (see <sup>1</sup> above) 


# Changelog

> **cryptox** module uses semver (http://semver.org/) for versioning: MAJOR.MINOR.PATCH.
> 1. MAJOR version increments when non-backwards compatible API changes are introduced
> 2. MINOR version increments when functionality in a backwards-compatible manner are introduced
> 3. PATCH version increments when backwards-compatible bug fixes are made


**IMPORTANT NOTE**: Major version zero (0.y.z) is for initial development. Anything may change at any time. The public API should not be considered stable.

See detailed Changelog (changelog.md)


# Documentation

## Constructor

Creates an instance of `Cryptox` object type.

```js
Cryptox(exchangeSlug [, options])
```

Depending on the parameters used, two types of objects can be created
1. **public** (without authentication) - can be used for calling public API methods
2. **private** (with authentication) - can be used for calling public and private API methods

#### Examples
```js
var account = new Cryptox("bitstamp", {key: "yourKey", secret: "yourSecret", username: "yourUserId"});
```

```js
var exchange = new Cryptox("bitstamp");
```

#### Arguments

* `exchangeSlug` is required and should have one values in table below
* `options` is used to pass parameters required for authentication, as indicated in table below

|Exchange name  | `exchangeSlug` | Authentication              |
| ---	        |    ---         |    ---                      |         
| Bitstamp      | `"bitstamp"`   | `key`, `secret`, `username` |
| BitX          | `"bitx"`       | `key`, `secret`             |
| BTC-e         | `"btce"`       | `key`, `secret`             |
| CEX.io        | `"cexio"`      | `key`, `secret`, `username` |

`options' should be used when calling methods that require authentication. Missing or incorrect key causes an error to be returned when calling a method that requires authentication (see [Authentication](#authentication)).   


## Methods

#### Examples

```js
getTicker(options, callback);
```

```js
getTicker({pair: "BTCUSD"}, function (err, result) {
    if (!err)
        console.log(result);
});
```

### Arguments

* `options` is a JSON object containing parameters specific for each API call
* `callback` is executed inside the method once the API response is received from the exchange 

#### Callbacks

The arguments passed to the callback function for each method are:

* `err` is an error object or `null` if no error occurred.
* `result` is JSON object containing the response.

    Example result:
    ```js
    {
        "timestamp": "2015-02-03T00:01:48+00:00",
        "error": "",
        "data": [
            {
                "pair": "BTCUSD",
                "last": 272.064,
                "bid": 272.064,
                "ask": 273.395,
                "volume": 7087.93047
            }
         ]
    }
    ```
   
                |  Type  | Description
     ---     	| ---    | ---                                                        
    `timestamp` | string | ISO 8601 date & time                                       
    `error`     | string | error message or `""` if no error                         
    `data`      | array  | array of one or more JSON objects containig the API result 
    
   
    
### Authentication

Following methods require authentication

|Method         | Requires authentication   |
| ---	        |    :-:                    |
|getTicker      |                           |
|getOrderBook   |                           |    
|getTrades      |                           |
|getFee         |     x<sup>1</sup>         |
|getTransactions|     x                     |
|getBalance     |     x                     |
|getOpenOrders  |     x                     |
|postSellOrder  |     x                     |
|placeBuyOrder  |     x                     |
|cancelOrder    |     x                     |

><sup>1</sup> BTC-e does not require authentication for `getFee`, since the fee is fixed amount

When calling a method that requires authentication, the object should have been constructed with parameters `key`, `secret` and (optional) `userId`.


### getTicker

Returns the latest ticker indicators.

```js
getTicker(options, callback);
```

#### Example
```js
exchange.getTicker({pair: "BTCUSD"}, function (err, ticker) {
    if (!err)
        console.log(ticker);
});
```
Example result:
```js
{
    "timestamp": "2015-02-03T00:01:48+00:00",
    "error": "",
    "data": [
        {
            "pair": "BTCUSD",
            "last": 272.064,
            "bid": 272.064,
            "ask": 273.395,
            "volume": 7087.93047
        }
     ]
}
```

#### Arguments

* `options`

Parameter  |  Type  | Required for | Description |
 ---	   | ---    |   :-:        | ---         |
`pair`     | string |   BTC-e      | trading pair|


* `callback` see [Callbacks](#callbacks)

#### Response

Parameter   |  Type   | Description
 ---	    | ---     | ---         
`pair`      | String  | trading pair
`last`      | Number  | last price
`bid`       | Number  | highest buy order 
`ask`       | Number  | lowest sell order
`volume`    | Number  | last 24 hours volume

Additional (optional) response parameters

Parameter   |  Type   | Availability / Description 
 ---	    | ---     | ---
`high`      | Number  | <sup>1</sup> last 24 hours price high
`low`       | Number  | <sup>1</sup> last 24 hours price low
`vwap`      | Number  | <sup>1</sup> last 24 hours [volume weighted average price](http://en.wikipedia.org/wiki/Volume-weighted_average_price)

> <sum>1</sup> Bitstamp

### getOrderBook

Returns a list of bids and asks in the order book. 
Ask orders are sorted by price ascending. Bid orders are sorted by price descending. 
Note that multiple orders at the same price are not necessarily conflated.

```js
cryptox.getOrderBook(options, callback);
```

#### Example

```js
exchange.getOrderBook({pair: "BTCUSD"}, function (err, orderBook) {
    if (!err)
        console.log(orderBook);
});
```
Example result:
```js
{
    "timestamp": ""2015-02-03T00:01:48+00:00"",
    "error": "",
    "data": [
        {
            "pair": "BTCUSD",
            "asks": [[212.962,0.014],[213,1.46820994],[213.226,3.78630967]],
            "bids": [[212.885,0.014],[212.827,0.00414864],[212.74,6.685]]
         }
    ]
}
```

#### Arguments

* `options` 

Parameter  |  Type  | Required    | Description |
 ---	   | ---    |   :-:       | ---         |
`pair`     | string |All exchanges| trading pair|

* `callback` see [Callbacks](#callbacks)

#### Response

Parameter   |  Type   |Required| Description                       |
 ---	    | ---     | :-:    | ---                               |
`timestamp` | String  |  Yes   | server time, ISO 8601 string      |
`error`     | Boolean |  Yes   | error message or `""` if no error |
`pair`      | String  |  Yes   | trading pair                      |
`asks`      | Array   |  Yes   | list of asks in the order book    |
`bids`      | Array   |  Yes   | list of bids in the order book    |


### getTrades

Returns a list of the most recent trades.


### getFee

```js
getFee(options, callback);
```
Returns a fee, which is a float that represents the amount the exchange takes out of the orders. If an exchange has a fee of 0.2% this would be `0.002`.

#### Example

```js
account.getFee({pair: "BTCUSD"}, function (err, fee) {
    if (!err)
	    console.log(fee);
});
```
Example result:
```js
{ 
	timestamp: "2015-02-01T20:59:53+00:00",
	data: [
	   {
		  pair: "BTCUSD",
		  fee: 0.002
	   }
	]
}
```

#### Arguments

* `options` parameter is not used at the moment and can have any value
* `callback` see [Callbacks](#callbacks)


### getTransactions
 

### getBalance


### getOpenOrders

```js
getOpenOrders(options, callback);
```
Returns the open orders

#### Example

```js
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
            "orderId": "563489985",
            "pair": "LTCUSD",
            "type": "buy",
            "amount": 1,
            "rate": 0.1,
            "status": 0,
            "timestamp": "2015-02-01T19:23:15+00:00"
        },
        {
            "orderId": "563612426",
            "pair": "LTCUSD",
            "type": "buy",
            "amount": 2,
            "rate": 0.5,
            "status": 0,
            "timestamp": "2015-02-01T20:59:53+00:00"
        }        
    ]
}
```

#### Arguments

* `options` 
    
Parameter  |  Type  | Required    | Description |
 ---	   | ---    |   :-:       | ---         |
`pair`     | string |  No         | trading pair|

    
* `callback` see [Callbacks](#callbacks)    

### postSellOrder


### postBuyOrder


### cancelOrder



# License #

The MIT License (MIT)

Copyright (c) 2015 Adrian Clinciu adrian.clinciu@outlook.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.