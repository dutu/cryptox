# cryptox ChangeLog

All notable changes to this module are documented in this file.
cryptox module adheres to [Semantic Versioning](http://semver.org/).

## [0.1.3] - unreleased
### Fixed
 
### Added
- Implement `getFee()` method for BitX
- Implement `getBalance()` method for BitX
- Implement `getFee()` method for Bitstamp
- Implement `getBalance()` method for Bitstamp
- Add parameter `account_id` to `getBalance()` API respose
- Add the CHANGELOG file

### Changed

- Change API response for `getFee()`. Parameter `fee` is replaced with `maker_fee` and `taker_fee` 
- Change Bitcoin symbol from "BTC" to "XBT"
- Update documentation

### Removed

