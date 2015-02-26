'use strict';

var moment = require("moment");
var jf = require("jsonfile");
var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-json-schema"));

var schema = require("./jsonSchemas.js");

// help functions for test modules

var util = {
    expectError: function (cryptox, method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
            done();
        });
    },

    expectError418: function (cryptox, method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema.errorResult);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
            expect(err.message).to.contain("418");
            expect(result.error).to.contain("418");
            done();
        });
    },

    expectValidSchema: function (cryptox, method, options, done) {
        cryptox[method](options, function (err, result) {
            expect(result).to.be.jsonSchema(schema[method]);
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true; // to be a valid ISO 8601 date
            done();
        });
    },

    expectMockResult: function (cryptox, method, options, done) {
        var writeMockResponseFile;
        if (options.hasOwnProperty("writeMockResponseFile")) {  // this option flag is only used for generating the mockResponseFile for the first time
            writeMockResponseFile = options.writeMockResponseFile;
            delete options.writeMockResponseFile;
        }
        cryptox[method](options, function (err, result) {
            var slug = cryptox.properties.slug;
            expect(err).to.be.null;
            expect(result).to.have.property("error").and.be.equal("");
            expect(moment(result.timestamp, moment.ISO_8601).isValid()).to.be.true;          // to be a valid ISO 8601 date
            var mockResponseFilename = __dirname + "/" + slug + "/" + slug + "-" + method + "_ExpectedMockResult.json";
            if (writeMockResponseFile)          // this option flag is only used for generating the mockResponseFile for the first time
                 jf.writeFileSync(mockResponseFilename, result);
            expect(result).to.have.property("data").and.to.be.deep.equal(jf.readFileSync(mockResponseFilename).data);
            done();
        });
    }
};
module.exports = util;