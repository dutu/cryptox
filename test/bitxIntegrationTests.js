var chai = require("chai");
var sharedTests = require("./shared/integrationTest.js");

// configure Integration tests variables below this line

var slug = "bitx";
var apiHost = {
    private: "https://api.mybitx.com",
    public:  "https://api.mybitx.com"
};

var publicMethodsToTest = ["getTicker", "getRate", "getOrderBook"];
var privateMethodsToTest = ["getBalance"];
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
