var chai = require("chai");
var sharedTests = require("./shared/integrationTest.js");

// configure Integration tests variables below this line

var slug = "bitstamp";
var apiHost = {
    private: "https://www.bitstamp.net",
    public:  "https://www.bitstamp.net"
};

var publicMethodsToTest = ["getTicker", "getRate", "getOrderBook"];
var privateMethodsToTest = ["getFee", "getBalance", "getTransactions"];
var writeMockResponseFileForMethod = "";

// don't change below this line; only configure above this line


describe("Integration Test " + slug + ":", function () {
    var contextIT = {                     // set context for Integration Testing
        slug: slug,
        apiHost: apiHost,
        publicMethodsToTest: publicMethodsToTest,
        privateMethodsToTest: privateMethodsToTest,
        writeMockResponseFileForMethod: writeMockResponseFileForMethod
    };
    sharedTests.integrationTest(contextIT);
});
