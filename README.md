cryptox
=======

cryptox is a node.js wrapper for REST API for multiple crypto currency exchanges.

cryptox manages API communication with different exchanges and  provides common methods for all exchanges. All differences between the different API's are abstracted away.

## Install ##

    npm install cryptox

## Example ##

```js
var Cryptox = require('cryptox');
var account = new Cryptox('bitstamp', {key: 'your_key', secret: 'your_secret', userId: 'your_userId'});
	
account.getBalance({}, function(err, balance){
	console.log(balance);
});
```

## Supported Exchanges and Implemented methods ##

|                                   | Bitstamp | BitX | BTC-e | CEX.io | 
|	---                             |   :-:    | :-:  |  :-:  |  :-:   |
|[getTicker](#getticker)            |          |      |   √   |        |
|[getOrderBook](#getorderbook)      |          |      |       |        |
|[getTrades](#gettrades)            |          |      |       |        |
|[getFee](#getfee)                  |          |      |   √   |        |
|[getTransactions](#gettransactions)|          |      |       |        |
|[getBalance](#getbalance)          |          |      |       |        |
|[getOpenOrders](#getopenorders)    |          |      |   √   |        |
|[postSellOrder](#postsellorder)    |          |      |       |        |
|[postBuyOrder](#postbuyorder)      |          |      |       |        |
|[cancelOrder](#cancelorder)        |          |      |       |        |


*if you are interested in extending cryptox for different exchange or a method not yet implemented, check out the document [exchanges.md](exchanges.md)*

## Constructor

```js
Cryptox(exchangeSlug [, options])
```

#### Parameters

* `exchangeSlug` is required and should have one of the following values in table below.

|Exchange name  | `exchangeSlug` | Authentication            |
| ---	        |    ---         |    ---                    |         
| Bitstamp      | `'bitstamp'`   | `key`, `secret`, `userId` |
| BitX          | `'bitx'`       | `key`, `secret`           |
| BTC-e         | `'btce'`       | `key`, `secret`           |
| CEX.io        | `'cexio'`      | `key`, `secret`, `userId` |




`key`, `secret` and `userId` are optional and should be used when calling methods / API calls that require authentication. Missing or incorrect key causes an error to be returned when calling a method that requires authentication (see [Authentication](#authentication)).   

#### Example
```js
var account = new Cryptox('bitstamp', your_key, your_secret, your_userId);
```

## Methods

### Callbacks

The arguments passed to the callback function for each method are:

1. `err` is an error object or `null` if no error occurred.
2. `data` is an object containing the data returned by the API


### Authentication

Following methods require authentication

|Method         | Requires authentication   |
| ---	        |    :-:                    |
|getTicker      |                           |
|getOrderBook   |                           |    
|getTrades      |                           |
|getFee         |     x                     |
|getTransactions|     x                     |
|getBalance     |     x                     |
|getOpenOrders  |     x                     |
|postSellOrder  |     x                     |
|placeBuyOrder  |     x                     |
|cancelOrder    |     x                     |

When calling a method that requires authentication, the object should have been constructed with parameters `key`, `secret` and (optional) `userId`.


### getTicker

Returns the latest ticker indicators

```js
cryptox.getTicker(options, callback);
```
#### Parameters

* `options` parameter is not used at the moment and can have any value
* `callback` The arguments passed to callback function are 
    * an `error` object or `null` if no error occured
    * an object containing the data returned by the API
    
    ```js
	{ 
		timestamp: <number>,
		error: <string>
		data: {
			pair: <string>,      // the pair (market) for which the data is applicable 
            last: <float>,
            bid: <float>,
            ask: <float>,
            volume: <float>
		}
	}
	
    ```   

#### Example

```js
account.getTicker({pair: 'BTCUSD'}, function (err, ticker) {
if (!err)
    console.log(ticker);
});
```
Result:
```js
{
    "timestamp": 1420935203,
    "error": "",
    "data": {
        "pair": "BTCUSD",
        "last": 272.064,
        "bid": 272.064,
        "ask": 273.395,
        "volume": 7087.93047
    }
}
```

### getOrderBook

Returns a list of bids and asks in the order book. Ask orders are sorted by price ascending. Bid orders are sorted by price descending. Note that multiple orders at the same price are not necessarily conflated.

```js
cryptox.getOrderBook(options, callback);
```
#### Parameters

* `options` 
       * `pair` The trading pair
* `callback` The arguments passed to callback function are 
    * an `error` object or `null` if no error occured
    * an object containing the data returned by the API
    
    ```js
	{ 
		timestamp: <number>,
		error: <string>
		data: {
            asks: <array>,
            bids: <array>,
		}
	}
	
    ```   

#### Example

```js
account.getOrderBook({pair: 'BTCUSD'}, function (err, orderBook) {
if (!err)
    console.log(orderBook);
});
```
Result:
```js
{
    "timestamp": "1422749694",
    "error": "",
    "data": {
        "pair": "BTCUSD",
        "asks": [[212.962,0.014],[213,1.46820994],[213.226,3.78630967]],
        "bids": [[212.885,0.014],[212.827,0.00414864],[212.74,6.685]]
    }
}
```


### getTrades

Returns a list of the most recent trades.


### getFee

```js
cryptox.getFee(options, callback);
```
Returns a fee, which is a float that represents the amount the exchange takes out of the orders. If an exchange has a fee of 0.2% this would be `0.002`.

#### Parameters

* `options` parameter is not used at the moment and can have any value
* `callback` The arguments passed to callback function are 
    * an `error` object or `null` if no error occured
    * an object containing the data returned by the API
    
    ```js
	{ 
		timestamp: <string>,
		data: {
			pair: <string>,      // the pair (market) for which the fee is applicable 
			fee: <float>         // that represents the amount the exchange takes out of the orders
		}
	}
	
    ```   
#### Example

```js
var fee = account.getFee({pair: 'BTCUSD'}, function (err, fee) {
    if (!err)
	    console.log(fee);
});
```
Result:
```js
{ 
	timestamp: '1420766742',
	data: {
		pair: 'BTCUSD',
		fee: 0.002
	}
}
```

### getTransactions
 
### getBalance

### getOpenOrders

```js
cryptox.getFee(options, callback);
```
Returns the open orders

#### Parameters

* `options` 
    * `pair` (optional) The trading pair. If not specified all active orders are returned
* `callback` The arguments passed to callback function are 
    * an `error` object or `null` if no error occured
    * an object containing the data returned by the API
    
   ```js
	{ 
		timestamp: <string>,          // UTC UNIX timestamp 
		error: <string>
		data: [                       // array of orders
            {
                "orderId": <number>,
                "pair": <string>,
                "type": <string>,
                "amount": <number>,
                "rate": <number>,
                "status": <number>,
                "timestamp": <number>
            },
            {
                ...
            }
		}
	}
	
    ```   
#### Example

```js
var fee = account.getOpenOrders({pair: 'LTCUSD'}, function (err, openOrders) {
    if (!err)
	    console.log(openOrders);
});
```
Result:
```js
{
    "timestamp": 1422824716,
    "error": "",
    "data": [
        {
            "orderId": "563489985",
            "pair": "LTCUSD",
            "type": "buy",
            "amount": 1,
            "rate": 0.1,
            "status": 0,
            "timestamp": 1422818595
        },
        {
            "orderId": "563612426",
            "pair": "LTCUSD",
            "type": "buy",
            "amount": 2,
            "rate": 0.5,
            "status": 0,
            "timestamp": 1422824393
        }        
    ]
}
```





### postSellOrder

### postBuyOrder

### cancelOrder


# License #

The MIT License (MIT)

Copyright (c) 2015 Adrian Clinciu adrian.clinciu@outlook.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.