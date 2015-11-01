var config = {};

config.slug = ["bitfinex", "bitstamp", "bitx", "btce", "newExchangeTemplate", "oxr", "coinbase"];

config.methods = ["getRate", "getTicker", "getOrderBook", "getTrades", "getFee", "getTransactions", "getBalance",
    "getOpenOrders", "postSellOrder", "postBuyOrder", "cancelOrder"];

module.exports = config;
