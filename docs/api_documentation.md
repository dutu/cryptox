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

|Exchange name        | `exchangeSlug` | Authentication               |
| ---	              |    ---         |    ---                       |         
| Bitfinex            | `"bitfinex"`   | `key`, `secret`              |
| Bitstamp            | `"bitstamp"`   | `key`, `secret`, `username`  |
| BitX                | `"bitx"`       | `key`, `secret`              |
| BTC-e               | `"btce"`       | `key`, `secret`              |
| CEX.io              | `"cexio"`      | `key`, `secret`, `username`  |
| Gdax                | `"gdax"`       | `key`, `secret`, `passphrase`|
| Poloniex            | `"poloniex"`   | `key`, `secret`              |
| Open Exchange Rates | `"oxr"`        | `key`                        |

`options` should be used when calling methods that require authentication. Missing or incorrect key/secret causes an error to be returned when calling a method that requires authentication (see [Authentication](#authentication)).   


## Methods

#### Examples

```js
getTicker(options, callback);
```

```js
getTicker({pair: "XBT_USD"}, function (err, result) {
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
                "pair": "XBT_USD",
                "last": "272.064",
                "bid": "272.064",
                "ask": "273.395",
                "volume": "7087.93047"
            }
         ]
    }
    ```
   
                |  Type  | Description
     ---     	| ---    | ---                                                        
    `timestamp` | string | ISO 8601 date & time                                       
    `error`     | string | error message or `""` if no error                         
    `data`      | array  | array of one or more JSON objects containig the API result 
    

### Results

The format of API result (see `result` in  [Callbacks](#callbacks)) above for each method is described in this document and it complies with JSON schemas in [jsonSchemas.js](../test/helpers/jsonSchemas.js)
    

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
            "pair": "EUR_USD",
            "rate": "1.149807",
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
`rate`      | String  | rate


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
            "last": "272.064",
            "bid": "272.064",
            "ask": "273.395",
            "volume": "7087.93047"
        }
     ]
}
```

#### Arguments

* `options`

Parameter  |  Type  | Required for  | Description |
 ---	   | ---    |   :-:         | ---         |
`pair`     | string |BTC-e, Bitfinex| trading pair|


* `callback` see [Callbacks](#callbacks)

#### Response

Parameter   |  Type   | Description
 ---	    | ---     | ---         
`pair`      | String  | trading pair
`last`      | String  | the price at which the last order executed
`bid`       | String  | highest buy order 
`ask`       | String  | lowest sell order
`volume`    | String  | trading volume of the last 24 hours

Optional response parameters

Parameter / Availability |  Type   | Description 
 ---	                 | ---     | ---
`high` <sup>[1] [2]</sup>       | String  | Highest trade price of the last 24 hours
`low` <sup>[1] [2]</sup>        | String  | Lowest trade price of the last 24 hours
`vwap` <sup>[1]</sup>       | String  | last 24 hours [volume weighted average price](http://en.wikipedia.org/wiki/Volume-weighted_average_price)

> <sup>[1]</sup> Bitstamp  
> <sup>[2]</sup> Bitfinex



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
            "asks": [{price: "212.962", volume: "0.014"}, {price: "213", volume: "1.46820994"}],
            "bids": [{price: "212.885", volume: "0.014"}, {price: "212.827", volume: "0.00414864"]}
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
		  maker_fee: "0",
		  taker_fee: "0.002"
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

Parameter                     |  Type  |Description                                                    |
 ---	                      | ---    |---                                                            |
`pair`                        | String |the trading pair or `""` if the fee is applicable for all pairs|
`maker_fee` <sup>[1] [2]</sup>| String |the amount (%) the exchange takes out of limit orders          |
`taker_fee` <sup>[1] [2]</sup>| String |the amount (%) the exchange takes out of orders that match immediately|

><sup>[1]</sup> `"maker"` fees are paid when you add liquidity to the orderbook, by placing a limit order under the ticker price for buy and above the ticker price for sell. `"taker"` fees are paid when you remove liquidity from the orderbook, by placing any order that is executed against an order of the orderbook.  if `type` is `""`, the fee is applicable both for maker and taker  
><sup>[2]</sup> If an exchange has a fee of 0.2% the fee would be `0.002`




### getTransactions

```js
getTransactions(options, callback);
```
Returns user transaction history. Transactions are returned in descending order (newer transactions first).
> Note: Depending on the exchange used and parameter combination this method can require up to 10 API calls

#### Example

```js
account.getTransactions({limit: 2, sort: "desc"}, function (err, transactions) {
    if (!err)
	    console.log(transactions);
});
```
Example result:
```js
{
    {
    "timestamp": "2015-02-25T22:37:19+00:00",
    "error": "",
    "data": [
        {
            "tx_id": "7624780",
            "datetime": "2015-02-24T12:02:27+00:00",
            "type": "sell",
            "symbol": "XBTUSD",
            "amount_base": "-0.30183411",
            "amount_counter": "72.62",
            "rate": "240.6",
            "fee_base": "0",
            "fee_counter": "0.15",
            "order_id": "58025817",
            "add_info": ""
        },
        {
            "tx_id": "7624695",
            "datetime": "2015-02-24T11:45:26+00:00",
            "type": "deposit",
            "symbol": "XBT",
            "amount_base": "49.04253049",
            "amount_counter": "0",
            "rate": "0",
            "fee_base": "0",
            "fee_counter": "0",
            "order_id": "",
            "add_info": ""
        }
    ]
}
```

#### Arguments

* `options`

    Parameter |  Type  | Required | Description |
     ---	  | ---    |   :-:    | ---         |
    `limit`   | Number |   no     | limit result to that many transactions. Default: `50`|
    `skip`    | Number |   no     | skip that many transactions before beginning to return results|
    `after`   | String |   no     | return only transactions after or at the time specified here (ISO 8601 string)|
    `before`  | String |   no     | return only transactions before or at the time specified here (ISO 8601 string)|
    `type`    | String |   no     | return only transactions of this type <sup>[1]</sup>. Default return all transactions|
    `symbol`  | String |   no     | return only transactions related to this curency symbol or curency pair |
    
    ><sup>[1]</sup> valid values are `"trades"` (for buys or sells) or `"movements"` (for deposits and withdrawals)       
    ><sup>[2]</sup> valid values are currecny symbols (3 characters) or trading pair symbols (6 characters).       
 
* `callback` see [Callbacks](#callbacks)    

#### Response

Parameter       | Type | Description|
 ---	        | ---  |---        |
`tx_id`         |String| transaction ID |
`datetime`      |String| ISO 8601 date & time of the transaction |
`type`          |String| transaction type: `"buy"`, `"sell"`, `"deposit"`, `"withdrawal"` |  
`symbol`        |String| currency symbol <sup>[1]</sup> or currency pair <sup>[2]</sup>|
`amount_base`   |String| currency amount <sup>[1]</sup> or base currency amount <sup>[3] [4]</sup>|
`amount_counter`|String| counter currency amount <sup>[3] [4]</sup>|
`rate`          |String| zero (`0`) <sup>[1]</sup> or the exchange rate <sup>[2] [3]</sup>|
`fee_base`      |String| amount of the fees debited |
`fee_counter`   |String| amount of the fees debited |
`order_id`      |String| the id of the parent order of the trade. Can be `""` |
`add_info`      |String| additional info. Can be `""` |


><sup>[1]</sup> for single currency transaction (`"deposit"` or `"withdrawal"`)  
><sup>[2]</sup> for trades / pair transaction (`"buy"` or `"sell"`)   
><sup>[3]</sup> See [Currency Pairs](#currency-pairs)   
><sup>[3]</sup> The `amount_base` and `amount_counter` are the amounts that were traded after the fees were deducted. These are the amounts that were credited/debited from your account     
 
 


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
            account_id: "8274332321",
            total: [
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

Parameter   | Type  | Description|
 ---	    | ---   |---        |
`account_id`| String| account ID / name |
`total`     | Array | account balance |
`available` | Array | funds available for trading (balance minus funds reserved in open orders. For margin accounts the leverage is taken into consideration, hence `available` can be higher than `total`) 


### getOpenOrders

```js
getOpenOrders(options, callback);
```
Returns the open orders.

#### Example

```js
account.getOpenOrders({pair: "LTC_USD"}, function (err, openOrders) {
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
            "pair": "LTC_USD",
            "type": "buy",
            "amount": "1",
            "rate": "0.1",
			"margin": true,
            "created_at": "2015-02-01T19:23:15+00:00",
            "status": "0"

        },
        {
            "order_id": "563612426",
            "pair": "LTC_USD",
            "type": "buy",
            "amount": "2",
            "rate": "0.5",
			"margin": false,
            "created_at": "2015-02-01T20:59:53+00:00",
            "status": "0"

        }        
    ]
}
```

#### Arguments

* `options` 
 
* `callback` see [Callbacks](#callbacks)    

#### Response

Parameter   | Type  | Description|
 ---	    | ---   |---  
`order_id`  | String| order ID
`pair`      | String| trading pair
`type`      | String| order type (`buy`, `sell`) 
`amount`    | String| trading amount
`rate`      | String| rate
`margin`    | Boolean| margin trading order
`created_at`| String| date&time when order was created, ISO 8601 string


Optional response parameters

Parameter / Availability |  Type   | Description 
 ---	                 | ---     | ---
`status`                 | Number  | order status <sup>[1]</sup>   

> <sup>[1]</sup> BTC-e API description doesn't clarify what status value means 


### postSellOrder


### postBuyOrder


### cancelOrder


### getLendBook

Returns the lend book. 
Note that multiple asks/bids at the same rate are not necessarily conflated.

```js
cryptox.getOrderBook(options, callback);
```

#### Example

```js
exchange.getLendBook({currency: "USD"}, function (err, orderBook) {
    if (!err)
        console.log(lendBook);
});
```
Example result:
```js
{
	"timestamp": "2015-03-14T16:49:12+00:00",
	"error": "",
	"data": [
		{
			"currency": "USD",
			"asks": [
				{
					"rate": "36.5",
					"amount": "1441.80137112",
					"period": 2,
					"frr": "yes"
					"created_at": "2015-03-14T16:32:17+00:00",
				}
			],
			"bids": [
				{
					"rate": "32.8573",
					"amount": "6163.37130384",
					"period": 30,
					"frr": "no"
					"created_at": "2015-03-14T15:27:38+00:00",
				}
	
			]
		}
	]
}
```

#### Arguments

* `options` 

    Parameter  |  Type  | Required    | Description |
     ---	   | ---    |   :-:       | ---         |
    `currency` | string |All exchanges| currecny    |

* `callback` see [Callbacks](#callbacks)

#### Response

Parameter   | Type |Required| Description                  |
 ---	    | ---  | :-:    | ---                          |
`asks`      |Array |  Yes   | loan offers                  |
`bids`      |Array |  Yes   | loan demands                 |
`rate`      |String|  Yes   | rate in % **per 365 days**   |
`amount`    |String|  Yes   | amount                       |
`period`    |Number|  Yes   | maximum no of days for the loan offers or minimum no of days for the demand offers   |
`frr`       |String|  Yes   | `"yes"` if the offer is at Flash Return Rate, `"no"` if the offer is at fixed rate |
`created_at`|String|  Yes   | date&time when offer was created, ISO 8601 string    |


### getActiveOffers


### postOffer


### cancelOffer




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


The first currency of a currency pair is called the "base currency", and the second currency is called the "counter currency". The currency pair shows how much of the counter currency is needed to purchase one unit of the base currency.

In example below the last price of the XBT_USD currency pair is 272.064.  

```js

    "timestamp": "2015-02-03T00:01:48+00:00",
    "error": "",
    "data": [
        {
            "pair": "XBT_USD",
            "last": 272.064,
            "bid": 272.064,
            "ask": 273.395,
            "volume": 7087.93047
        }
     ]
}

```

This means that 1 Bitcoin was exchanged for 272.006 US dollars.
