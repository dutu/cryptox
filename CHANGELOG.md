# cryptox ChangeLog

All notable changes to this module are documented in this file.
cryptox module adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0] - 2016-10-17

### Changed
- name Coinbase changed to Gdax
- all numeric response parameters are now returned as string
- parameter `pair` is represented with `_` between curency symbols (eg `USD_BTC` instead of `USDBTC`) 

### Added
- parameter `margin` added to `getOpenOrder` result
- implement `poloniex.postSellOrder()`
- implement `poloniex.postBuyOrder()`
- implement `poloiex.getMarginPositions()`


## [0.2.2] - 2015-11-01

### Added
- Implement `bitx.getTransactions()`
- Implement `bitfinex.getLendBook()`
- Implement `coinbase.getRate()`
- Implement `coinbase.getTicker()`
- Implement `coinbase.getOrderBook()`
- Implement `coinbase.getTrades()`
- Implement `coinbase.getBalance()`


## [0.2.1] - 2015-03-10

### Fixed
- Fix: `bitfinex.getTicker()` returns the result with invalid JSON schema
- Fix: `btce.getFee()` requires `pair` as parameter
- Fix: bitfinex methods return BTC instead of XBT

### Added
- Implement `bitstamp.getTransactions()`
- Implement `bitfinex.getTransactions()`


## [0.2.0] - 2015-02-15

### Fixed
- Fix: `bitstamp.getFee()` does not return error when invalid API keys

### Added
- Add parameter `account_id` to `getBalance()` response
- Implement `bitstamp.getBalance()` method
- Implement `bitstamp.getFee()` method
- Implement `bitx.getBalance()` method
- Implement `bitx.getFee()` method
- Implement `bitfinex.getTicker()` method
- Implement `bitfinex.getOrderBook()` method
- Implement `bitfinex.getBalance()` method
- Add the CHANGELOG file

### Changed

- Change: API response for `getOrderbook()`. `asks` and `bids` are now arrays of JSON
- Change: API response for `getFee()`. Parameter `fee` is replaced with `maker_fee` and `taker_fee` 
- Change: Bitcoin symbol from "BTC" to "XBT"
- Update documentation

