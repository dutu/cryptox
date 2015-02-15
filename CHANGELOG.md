# cryptox ChangeLog

All notable changes to this module are documented in this file.
cryptox module adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] - 2014-02-15
### Fixed
- Fix bitstamp.getFee() was not returning error when API keys invalid
- 
### Added
- Add parameter `account_id` to `getBalance()` response
- Implement `getBalance()` method for Bitstamp
- Implement `getFee()` method for Bitstamp
- Implement `getBalance()` method for BitX
- Implement `getFee()` method for BitX
- Implement `getTicker()` method for Bitfinex
- Implement `getOrderBook()` method for Bitfinex
- Implement `getBalance()` method for Bitfinex
- Add the CHANGELOG file

### Changed

- Change API response for `getOrderbook()`. `asks` and `bids` are now arrays of JSON
- Change API response for `getFee()`. Parameter `fee` is replaced with `maker_fee` and `taker_fee` 
- Change Bitcoin symbol from "BTC" to "XBT"
- Update documentation

