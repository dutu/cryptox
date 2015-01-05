
// name: Proper name of the exchange
// slug: slug name of the exchange
// direct: does this exchange support market orders?
// infinityOrder: is this an exchange that supports infinity
//    orders? (which means that it will accept orders bigger then
//    the current balance and order at the full balance instead)
// pairs: all allowed currency / asset combinatinos that form a market
// providesHistory: If the getTrades can be fed a since parameter
//    that Gekko can use to get historical data, set this to:
//
//    - 'date' // When Gekko can pass in a starting point in time
//             // to start returning data from.
//    - 'tid'  // When Gekko needs to pass in a trade id to act as
//             // a starting point in time.
//    - false  // When the exchange does not support to give back
//             // historical data at all.
// monitorError: if not able to monitor this exchange, please set it
//     to an URL explaining the problem.
// tradeError: if not able to trade at this exchange, please set it
//    to an URL explaining the problem.
var providers = [
    {
        name: 'BTC-e',
        slug: 'btce',
        marketOrder: false,
        infinityOrder: false,
        markets: [
            {
                pair: 'USDBTC'
            },
            {
                pair: 'RURBTC'
            },
            {
                pair: 'EURBTC'
            },
            {
                pair: 'BTCLTC'
            },
            {
                pair: 'USDLTC'
            },
            {
                pair: 'RURLTC'
            },
            {
                pair: 'EURLTC'
            },
            {
                pair: 'BTCNMC'
            },
            {
                pair: 'USDNMC'
            },
            {
                pair: 'BTCNVC'
            },
            {
                pair: 'USDNVC'
            },
            {
                pair: 'RURUSD'
            },
            {
                pair: 'USDEUR'
            },
            {
                pair: 'BTCTRC'
            },
            {
                pair: 'BTCPPC'
            },
            {
                pair: 'USDPPC'
            },
            {
                pair: 'BTCFTC'
            },
            {
                pair: 'BTCXPM'
            }
        ],
        requires: ['key', 'secret'],
        providesHistory: false
    },
    {
        name: 'Bitstamp',
        slug: 'bitstamp',
        marketOrder: false,
        infinityOrder: false,
        markets: [
            {
                pair: 'USDBTC'
            }
        ],
        requires: ['key', 'secret', 'username'],
        providesHistory: false,
        fetchTimespan: 60
    },
    {
        name: 'CEX.io',
        slug: 'cexio',
        marketOrder: false,
        infinityOrder: false,
        markets: [
            {
                pair: 'BTCGHS'
            }
        ],
        requires: ['key', 'secret', 'username'],
        providesHistory: false
    },
    {
        name: 'Cryptsy',
        slug: 'cryptsy',
        marketOrder: false,
        infinityOrder: false,
        markets: [
            {
                pair: 'BTCXGD', market_id: 132
            },
            {
                pair: 'BTCDVC', market_id: 40
            },
            {
                pair: 'BTCLTC', market_id: 3
            },
            {
                pair: 'BTCDRK', market_id: 155
            }
        ],
        requires: ['key', 'secret'],
        providesHistory: false
    },
    {
        name: 'Kraken',
        slug: 'kraken',
        marketOrder: false,
        infinityOrder: false,
        markets: [
            {
                pair: 'XRPLTC'
            },
            {
                pair: 'EURLTC'
            },
            {
                pair: 'KRWLTC'
            },
            {
                pair: 'USDLTC'
            },
            {
                pair: 'XRPNMC'
            },
            {
                pair: 'EURNMC'
            },
            {
                pair: 'KRWNMC'
            },
            {
                pair: 'USDNMC'
            },
            {
                pair: 'LTCXBT'
            },
            {
                pair: 'NMCXBT'
            },
            {
                pair: 'XRPXBT'
            },
            {
                pair: 'XVNXBT'
            },
            {
                pair: 'EURXBT'
            },
            {
                pair: 'KRWXBT'
            },
            {
                pair: 'USDXBT'
            },
            {
                pair: 'XRPXVN'
            },
            {
                pair: 'XRPEUR'
            },
            {
                pair: 'XVNEUR'
            },
            {
                pair: 'XRPKRW'
            },
            {
                pair: 'XRPUSD'
            },
            {
                pair: 'XVNUSD'
            }
        ],
        requires: ['key', 'secret'],
        monitorError: 'https://github.com/askmike/gekko/issues/210',
        providesHistory: false
    },
    {
        name: 'Bitfinex',
        slug: 'bitfinex',
        marketOrder: false,
        infinityOrder: false,
        markets: [
            {
                pair: 'USDBTC'
            }
        ],
        requires: ['key', 'secret'],
        // TODO: should be possible to enable this for Bitfinex?
        providesHistory: false
        // fetchTimespan: 60
    },
    {
        name: 'LakeBTC',
        slug: 'lakebtc',
        marketOrder: false,
        infinityOrder: false,
        markets: [
            {
                pair: 'USDBTC'
            }
        ],
        requires: ['key', 'secret'],
        providesHistory: false,
        fetchTimespan: 60
    }
];

module.exports = providers;
