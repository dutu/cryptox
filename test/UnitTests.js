'use strict';

var Cryptox = require("../index.js");
var https = require("https");
var sinon = require("sinon");
var chai = require("chai");
//  FakeRequest = require('./helpers/FakeRequest');

var expect = chai.expect;

describe('Constructor', function() {

    it('should create a new instance', function() {
        var cryptox = new Cryptox("bitstamp");
        expect(cryptox).to.be.an.instanceOf(Cryptox);
    });

    it('should create a new instance without the new keyword', function() {
        var cryptox = Cryptox("bitstamp");
        expect(cryptox).to.be.an.instanceOf(Cryptox);
    });

    it('should have default options', function() {
        var cryptox = new Cryptox("bitstamp");
        expect(cryptox.options.lang).to.equal("en");
    });

    it('should accept options', function() {
        var options = {
            lang: "de",
            key: "my_key",
            secret: "my_secret",
        };
        var cryptox = new Cryptox("bitstamp", options);
        expect(cryptox.options.lang).to.equal("de");
        expect(cryptox.options.key).to.equal("my_key");
        expect(cryptox.options.secret).to.equal("my_secret");
    });


});

