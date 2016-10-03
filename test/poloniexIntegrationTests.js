'use strict';

const chai = require('chai');
const sharedTests = require('./shared/integrationTest.js');

// configure Integration tests variables below this line
const slug = "poloniex";
const apiHost = {
    private: 'https://poloniex.com',
    public:  'https://poloniex.com',
};

const publicMethodsToTest = ['getTicker', 'getRate', 'getOrderBook'];
const privateMethodsToTest = ['getBalance', 'getOpenOrders'];
const writeMockResponseFileForMethod = '';

// don't change below this line; only configure above this line
describe("Integration Test " + slug + ":", function () {
    let contextIT = {                     // set context for Integration Testing
        slug: slug,
        apiHost: apiHost,
        publicMethodsToTest: publicMethodsToTest,
        privateMethodsToTest: privateMethodsToTest,
        writeMockResponseFileForMethod: writeMockResponseFileForMethod
    };
    sharedTests.integrationTest(contextIT);
});

