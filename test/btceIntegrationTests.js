'use strict';

const chai = require('chai');
const sharedTests = require('./shared/integrationTest.js');

// configure Integration tests variables below this line

const slug = 'btce';
const apiHost = {
    private: 'https://btc-e.com',
    public:  'https://btc-e.com'
};

const publicMethodsToTest = ['getRate', 'getTicker', 'getOrderBook'];
const privateMethodsToTest = ['getFee', 'getOpenOrders'];
const writeMockResponseFileForMethod = '';
const nativeCalls = [
    ['ticker']
];

// don't change below this line; only configure above this line


describe('Integration Test ' + slug + ':', function () {
    let contextIT = {                     // set context for Integration Testing
        slug: slug,
        apiHost: apiHost,
        publicMethodsToTest: publicMethodsToTest,
        privateMethodsToTest: privateMethodsToTest,
        writeMockResponseFileForMethod: writeMockResponseFileForMethod,
        nativeCalls: nativeCalls,
    };
    sharedTests.integrationTest(contextIT);
});

