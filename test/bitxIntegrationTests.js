const chai = require("chai");
const sharedTests = require("./shared/integrationTest.js");

// configure Integration tests variables below this line

const slug = "bitx";
const apiHost = {
    private: "https://api.mybitx.com",
    public:  "https://api.mybitx.com"
};

//const publicMethodsToTest = ["getTicker", "getRate", "getOrderBook"];
//const privateMethodsToTest = ["getBalance"];
const publicMethodsToTest = ["getTicker"];
const privateMethodsToTest = ["getOpenOrders"];
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
