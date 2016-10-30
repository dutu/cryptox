'use strict';

const chai = require('chai');
const sharedTests = require('./shared/integrationTest.js');

// configure Integration tests variables below this line
const slug = "oxr";
const apiHost = {
    private: 'http://openexchangerates.org',
    public:  'http://openexchangerates.org',
};

const publicMethodsToTest = [];
const privateMethodsToTest = ['getRate'];
const writeMockResponseFileForMethod = '';
const nativeCalls = [
    ['latest']
];

// don't change below this line; only configure above this line
describe("Integration Test " + slug + ":", function () {
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

