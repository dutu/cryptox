var chai = require("chai");
var sharedTests = require("./shared/integrationTest.js");

// configure Integration tests variables below this line

var slug = "btce";
var apiHost = {
    private: "https://btc-e.com",
    public:  "https://btc-e.com"
};

var publicMethodsToTest = ["getTicker", "getRate", "getOrderBook", "getFee"];
var privateMethodsToTest = ["getOpenOrders"];
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

