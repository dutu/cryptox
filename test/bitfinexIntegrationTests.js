'use strict';

const chai = require("chai");
const sharedTests = require("./shared/integrationTest.js");

// configure Integration tests variables below this line

const slug = "bitfinex";
const apiHost = {
    private: "https://api.bitfinex.com",
    public:  "https://api.bitfinex.com"
};

const publicMethodsToTest = ["getTicker", "getRate", "getOrderBook", "getLendBook"];
const privateMethodsToTest = ["getBalance", "getTransactions"];
const writeMockResponseFileForMethod = "";

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
