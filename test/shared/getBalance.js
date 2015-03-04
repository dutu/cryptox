"use strict";

// See https://github.com/mochajs/mocha/wiki/Shared-Behaviours

var chai = require("chai");
var moment = require("moment");
var _ = require("lodash");

var expect = chai.expect;
chai.use(require("chai-json-schema"));

var schema = require("../helpers/jsonSchemas.js");

exports.shouldVerifyParameters = function() {
    /*
     it("parameter test is not required", function (done) {
         done();
     });
     */
};