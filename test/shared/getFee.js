"use strict";

// See https://github.com/mochajs/mocha/wiki/Shared-Behaviours

const chai = require("chai");
const _ = require("lodash");

const expect = chai.expect;
chai.use(require("chai-json-schema"));

const schema = require("../helpers/jsonSchemas.js");

exports.shouldVerifyParameters = function() {
     it("parameter test is not required", function (done) {
         done();
     });
};