# Exchanges

*This is a technical document about the requirements per exchange as implemented for cryptox in the `lib` folder. Check out this document if you are interested in extending cryptox for different exchanges. Fork this repository on github and send me a pull request.*

*For additional clarification, please look at the exchanges already implemented in `lib` folder.*

cryptox manages API communication with different exchanges and  provides common methods for all exchanges. All differences between the different API's are abstracted away. This document describes all requirements for adding a new exchange to cryptox. 

## cryptox's expectations

When you add a new exchange to cryptox you need to expose an object that has methods to query the exchange. The object is be defined in a file that needs to reside in `lib` folder; the filename is the slug of the exchange name + `.js`. So for example the exchange for Bitstamp is implemented in `lib/bitstamp.js`.

It is advised to use a npm module to query an exchange. This will separate the abstract API calls from the cryptox specific stuff (for example in the case of Bitstamp npm module used is [bitstamp](https://www.npmjs.com/package/bitstamp).


cryptox implements an exchange like this:
```js
    var Exchange = require('./lib/' + exchangeSlug);
    exchange = new Exchange(options);
```

It will run the methods on the exchange object as in example below:

```js
    exchange.getTicker(options, callback)
```

The template file `newExchangeTemplate.js` is provided in the `lib` folder, which can be used as starting point. 


Each exchange:

* should have a `slug`, for example `bitfinex` for Bitfinex, `btce` for BTC-e, etc 

* should be defined in `lib` folder in a filename slug.js (for example `lib/bitfinex.js`)

* constructor should take optional parameter for authentication 

* Should have all methods defined: `getRate`, `getTicker`, `getOrderBook`, `getTrades`, `getFee`, `getTransactions`, `getBalance`, `getOpenOrders`, `postSellOrder`, `postBuyOrder`, `cancelOrder`  
  
  If functionality of a method is not implemented the method needs to return an error with specific error message.

* should have properties `property.name`, `property.slug`, `property.instruments`

