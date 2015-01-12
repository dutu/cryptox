# Exchanges

*This is a technical document about the requirements per exchange as implemented for cryptox in the `lib` folder. Check out this document if you are interested in extending cryptox for different exchanges. Fork this repository on github and send me a pull request.*

*If this documentation is not clear, please look at the exchanges already implemented in `lib` folder.*

cryptox manages API communication with different exchanges and  provides common methods for all exchanges. All differences between the different API's are abstracted away. This document describes all requirements for adding a new exchange to cryptox. 

## cryptox's expectations

When you add a new exchange to cryptox you need to expose an object that has methods to query the exchange. This exchange file needs to reside in `lib` folder and the filename is the slug of the exchange name + `.js`. So for example the exchange for Bitstamp is implemented in `lib/bitstamp.js`.

It is advised to use a npm module to query an exchange. This will seperate the abstract API calls from the cryptox specific stuff (for example in the case of Bitstamp npm module used is [bitstamp](https://www.npmjs.com/package/bitstamp).


cryptox implements an exchange like this:
```js
    var Exchange = require('./lib/' + exchangeSlug);
    this.exchange = new Exchange(key, secret, userId);
```

It will run the methods on the exchange object.
All methods need to be defined on exchange object, as detailed in [README.md](README.md#methods). If functionality of a method is not implemented the method needs to return an error with specific error message.

Example:
**getTicker**
```js
    this.exchange.getTicker(options, callback)
```
Returns the latest ticker indicators

