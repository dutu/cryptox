cryptox API Documentation
=======

### Contents
* [Constructor](#constructor)
* [Methods](#methods)
    * [getRate](#getrate)
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
* [NOTES](#notes)
    * [Currency Symbols](#currency-symbols)
    * [Currency Pairs](#currency-pairs)



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
var account = new Cryptox("btce", {key: "yourKey", secret: "yourSecret"});
```

```js
var exchange = new Cryptox("btce");
```

#### Arguments

* `exchangeSlug` is required and should have one values in table below
* `options` is used to pass parameters required for authentication, as indicated in table below

|Exchange name        | `exchangeSlug` | Authentication              |
| ---	              |    ---         |    ---                      |         
| Bitstamp            | `"bitstamp"`   | `key`, `secret`, `username` |
| BitX                | `"bitx"`       | `key`, `secret`             |
| BTC-e               | `"btce"`       | `key`, `secret`             |
| CEX.io              | `"cexio"`      | `key`, `secret`, `username` |
| Open Exchange Rates | `"oxr"`        | `key`                       |

`options` should be used when calling methods that require authentication. Missing or incorrect key/secret causes an error to be returned when calling a method that requires authentication (see [Authentication](#authentication)).   


## Methods

#### Examples

```js
getTicker(options, callback);
```

```js
getTicker({pair: "XBTUSD"}, function (err, result) {
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
                "pair": "XBTUSD",
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

|Method         | Requires authentication
| ---	        |    :-:                 
|getRate        |     <sup>[1]</sup>       
|getTicker      |                        
|getOrderBook   |                            
|getTrades      |                        
|getFee         |     √ <sup>[2]</sup>      
|getTransactions|     √                  
|getBalance     |     √                  
|getOpenOrders  |     √                  
|postSellOrder  |     √                  
|placeBuyOrder  |     √                  
|cancelOrder    |     √                  

><sup>1</sup> Open Exchange Rates (OXR) requires authentication  
><sup>2</sup> BTC-e and BitX does not require authentication (since the fee is fixed amount)

When calling a method that requires authentication, the object should have been constructed with parameters `key`, `secret` and (optional) `userId`.


### getRate

Returns the exchange rate.

```js
getRate(options, callback);
```

#### Example
```js
exchange.getRate({pair: "EURUSD"}, function (err, rate) {
    if (!err)
        console.log(rate);
});
```
Example result:
```js
{
    "timestamp": "2015-02-04T20:01:09+00:00",
    "error": "",
    "data": [
        {
            "pair": "EURUSD",
            "rate": 1.149807,
        }
     ]
}
```

#### Arguments

* `options`

Parameter  |  Type  | Required for | Description  |
 ---	   | ---    |   :-:        | ---          |
`pair`     | string |   All        | currency pair|


* `callback` see [Callbacks](#callbacks)

#### Response

Parameter   |  Type   | Description
 ---	    | ---     | ---         
`pair`      | String  | currency pair
`rate`      | Number  | rate


### getTicker

Returns the latest ticker indicators.

```js
getTicker(options, callback);
```

#### Example
```js
exchange.getTicker({pair: "XBTUSD"}, function (err, ticker) {
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
            "pair": "XBTUSD",
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

Optional response parameters

Parameter / Availability |  Type   | Description 
 ---	                 | ---     | ---
`high`<sup>1</sup>       | Number  | last 24 hours price high
`low`<sup>1</sup>        | Number  | last 24 hours price low
`vwap`<sup>1</sup>       | Number  | last 24 hours [volume weighted average price](http://en.wikipedia.org/wiki/Volume-weighted_average_price)

> <sup>1</sup> Bitstamp



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
            "pair": "XBTUSD",
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
Returns the fee, which is a float that represents the amount the exchange takes out of the orders. 

#### Example

```js
account.getFee({pair: "XBTUSD"}, function (err, fee) {
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
		  pair: "XBTUSD",
		  maker_fee: 0
		  taker_fee: 0.002
	   }
	]
}
```

#### Arguments

* `options` parameter is not used at the moment and can have any value
* `callback` see [Callbacks](#callbacks)

#### Response

Parameter                     |  Type  |Description                                                    |
 ---	                      | ---    |---                                                            |
`pair`                        | String |the trading pair or `""` if the fee is applicable for all pairs|
`maker_fee` <sup>[1] [2]</sup>| Number |the amount (%) the exchange takes out of limit orders          |
`taker_fee` <sup>[1] [2]</sup>| Number |the amount (%) the exchange takes out of orders that match immediately|

><sup>[1]</sup> `"maker"` fees are paid when you add liquidity to the orderbook, by placing a limit order under the ticker price for buy and above the ticker price for sell. `"taker"` fees are paid when you remove liquidity from the orderbook, by placing any order that is executed against an order of the orderbook.  if `type` is `""`, the fee is applicable both for maker and taker  
><sup>[2]</sup> If an exchange has a fee of 0.2% the fee would be `0.002`




### getTransactions
 

### getBalance

```js
getBalance(options, callback);
```
Returns the account balance.

#### Example

```js
account.getBalance({}, function (err, balance) {
    if (!err)
	    console.log(balance);
});
```
Example result:
```js
{
    timestamp: "2015-02-06T17:53:02+00:00",
    error: "",
    data: [
        {
            account_id: "1224342323",
            balance: [
                {currency: "XBT", amount: "4.86509177"},
                {currency: "USD", amount: "100.44"}
            ],
            available: [
                {currency: "XBT", amount: "2.86709177"},
            ]
        }
    ]
}
```

#### Arguments

* `options` argument is not used and it is ignored 
 
* `callback` see [Callbacks](#callbacks)    

#### Response

Parameter   | Type  |Description                                                |
 ---	    | ---   |---                                                        |
`account_id`| String | account ID / name |
`balance`   | Array | account balance |
`available` | Array | funds available for trading (balance minus funds reserved in open orders)


### getOpenOrders

```js
getOpenOrders(options, callback);
```
Returns the open orders.

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


## Notes ##

### Currency Symbols ###
cryptox uses [ISO 4217 currency codes](http://en.wikipedia.org/wiki/ISO_currency_code) for fiat currencies and 3 letter symbols for cryptocurrencies 

Currency | Symbol
---------|-------
Auroracoin | AUR
**Bitcoin**	   | **XBT** <sup>[1]</sup>
BlackCoin  | BLK
Darkcoin   | DRK
Dogecoin   | DGE
Gridcoin   | GRC
Litecoin   | LTC
Mastercoin | MSC
MazaCoin   | MZC
Monero     | XMR
Namecoin   | NMC
Nxt        | NXT
Peercoin   | PPC
PotCoin    | POT
Primecoin  | XPM
Ripple     | XRP
Titcoin    | TIT


> <sup>[1]</sup> See [FAQ](faq.md)

### Currency Pairs ##


The first currency of a currency pair is called the "base currency", and the second currency is called the "quote currency". The currency pair shows how much of the quote currency is needed to purchase one unit of the base currency.

In example below the last price of the XBTUSD currency pair is 272.064.  

```js

    "timestamp": "2015-02-03T00:01:48+00:00",
    "error": "",
    "data": [
        {
            "pair": "XBTUSD",
            "last": 272.064,
            "bid": 272.064,
            "ask": 273.395,
            "volume": 7087.93047
        }
     ]
}

```

This means that 1 Bitcoin was exchanged for 272.006 US dollars.
