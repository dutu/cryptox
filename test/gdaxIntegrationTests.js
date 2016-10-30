'use strict';

const chai = require('chai');
const sharedTests = require('./shared/integrationTest.js');

// configure Integration tests variables below this line

const slug = 'gdax';
const apiHost = {
    private: 'https://api.gdax.com',
    public:  'https://api.gdax.com'
};

const publicMethodsToTest = ['getRate', 'getTicker', 'getOrderBook', 'getTrades'];
const privateMethodsToTest = [];
const writeMockResponseFileForMethod = '';
const nativeCalls = [
    ['getTicker']
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
